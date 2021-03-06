Class('Shotenjin.Template', {
    
    have : {
        escapeTable : { 
            '&'     : '&amp;', 
            '<'     : '&lt;', 
            '>'     : '&gt;', 
            '"'     : '&quot;' 
        }
    },
    
    has : {
        stash                   : null,
        
        startTag                : '[%',
        endTag                  : '%]',
        
        statementTagModifier    : '\\',
        expressionTagModifier   : '=',
        
        sources                 : { is : 'rw' },
        isCompiled              : false,
        
        compiled                : null,
        
        contexts                : Joose.I.Array
    },
    
    
    methods : {
        
        escapeRe : function (str) {
            return str.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
        },
        
        
        escapeSymbol : function (symbol) {
            return this.escapeTable[symbol] 
        },
        
        
        escapeXml : function (s) {
            var me = this
            
            return typeof s != 'string' ? s : s.replace(/[&<>"]/g, function (match) {
                return me.escapeSymbol(match)
            })
        },

        
//        trim : function (s) {
//            return s.replace(/^\s+/, '').replace(/\s+$/, '')
//        },
//        
//        
//        trimMulti : function (s) {
//            return s.replace(/^(.*)$/mg, this.trim)
//        },
            
        
        expandStashToVarsCode : function (stash) {
            var buf = []
            
            Joose.O.each(stash || {}, function (value, name) {
                buf.push("var ", name, " = stash['", name, "']; ")
            })
            
            buf.push(
                'var __contexts = this.contexts;',
                'var __me = this;'
            )
            
            return buf.join('')
        },
        
        
        render : function (stash) {
            if (!this.isCompiled) this.compile()
            
            return this.compiled.call(this, Joose.O.getMutableCopy(stash))
        },
        
        
        setSources : function (sources) {
            this.isCompiled = false
            
            this.sources = sources 
        },
        
        
        compile : function () {
            var parsed = this.parse(this.sources)
            
            try {
                this.compiled = eval(parsed)
            } catch (e) {
                
                if (typeof console != 'undefined') console.log("Syntax error when parsing the template function: " + parsed)
                
                throw e
            }
            
            this.isCompiled = true
        },
        
        
        wrapper : function (template, stash, func) {
            stash.content = this.capture(func)
            
            if (template instanceof Shotenjin.Template) 
                this.echoRaw(template.render(stash))
            else
                if (typeof template == 'function' && template.meta instanceof Shotenjin) 
                    this.echoRaw(template(stash))
        },
        
        
        
        capture : function (func) {
            this.startContext()
            
            func.call(this)
            
            return this.endContext()
        },
        
        
        startContext : function () {
            this.contexts.unshift({
                output      : []
            })
        },
        
        
        endContext : function () {
            var context = this.contexts.shift()
            
            return context.output.join('')
        },
        
        
        echo : function () {
            var output = this.contexts[0].output
            
            Joose.A.each(arguments, function (arg) {
                output.push(this.escapeXml(arg))
            }, this)
        },
        
        
        echoRaw : function () {
            var output = this.contexts[0].output
            
            Joose.A.each(arguments, function (arg) {
                output.push(arg)
            }, this)
        },
        
        
        parse : function (source) {
//            source = this.trimMulti(source || '')

            // statements will "eat" trailing whitespace, as they are "invisible"            
            var statementRegexSource = this.escapeRe(this.startTag + this.statementTagModifier) + '((?:.|\\n)*?)' + this.escapeRe(this.endTag) + '\\n?'
            var statementRegex = new RegExp(statementRegexSource, 'g')
            
            
            // need to wrap with variable assignment for IE
            var result = [
                'var __t__ = (function (stash) { ',
                    'this.startContext(); ',
                    'eval(this.expandStashToVarsCode(stash)); '
            ]
            
            this.splitAndProcess(result, statementRegex, source, this.emitExpressions, this.emitCode)
            
            result.push(
                    '; return this.endContext(); ',
                '}); __t__'
            )
            
            return result.join('')
        },
        
        
        emitCode : function (result, match) {
            result.push(match[1])
        },
        
        
        emitExpressions : function (result, source) {
            // expressions will leave trailing whitespace as is, as they are usual text content
            var expressionRegexSource = this.escapeRe(this.startTag) + '((' + this.escapeRe(this.expressionTagModifier) + ')?((?:.|\\n)*?))' + this.escapeRe(this.endTag) // + '\\n?'
            var expressionRegex = new RegExp(expressionRegexSource, 'g')
            
            
            result.push(
                ';__contexts[0].output.push('
            )
            
            this.splitAndProcess(result, expressionRegex, source, this.emitText, this.emitExpression)
            
            result.push(
                    '""',  
                '); '
            )
        },
        
        
        emitText : function (result, source) {
            result.push("'", source.replace(/[\'\\]/g, '\\$&').replace(/\n/g, '\\n'), "', ")
        },
        
        
        emitExpression : function (result, match) {
            
            if (match[2] == this.expressionTagModifier)
                result.push(match[3])
            else
                result.push(
                    '__me.escapeXml(' + match[1] + ')'
                )
                
                
            result.push(', ')
        },
        
        
        splitAndProcess : function (result, regex, source, processWhiteSpace, processMatch) {
            var pos = regex.lastIndex = 0
            var match
            
            while ((match = regex.exec(source)) != null) {
                
                var whitespace = source.substring(pos, match.index)
                
                pos = match.index + match[0].length
                
                if (whitespace) processWhiteSpace.call(this, result, whitespace)
                
                processMatch.call(this, result, match)
            }
            
            var rest = pos == 0 ? source : source.substring(pos)
            
            if (rest) processWhiteSpace.call(this, result, rest)
        }
    }
    //eof methods
    
})
