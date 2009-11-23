StartTest(function(t) {
    
    t.plan(3)
    
    var async0 = t.beginAsync()
    
    use('Shotenjin.Joosed', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(Shotenjin.Joosed, "Shotenjin.Joosed is here")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Integral test')

        Class('My.Template', {
            
            meta : 'Shotenjin.Joosed',
            
            template : {
                /*tj
        
                    [%\
                        var pos = 1
                        
                        Joose.O.each(stash, function (value, name) {
                            if (pos % 2) {
                    %]
                    
                                [% "name: [" + name + "], value: [" + value + "]\n" %]
                    [%\
                            } else {
                    %]
                                [% "value: [" + value + "], name: [" + name + "]\n" %]
                    [%\
                            }
                            
                            pos++
                        })
                    %]
                
                tj*/

                /* GENERATED BY SHOTENJIN.JOOSED HELPER, DO NOT MODIFY DIRECTLY */
                sources : '[%\\\nvar pos = 1\nJoose.O.each(stash, function (value, name) {\nif (pos % 2) {\n%]\n[% "name: [" + name + "], value: [" + value + "]\\n" %]\n[%\\\n} else {\n%]\n[% "value: [" + value + "], name: [" + name + "]\\n" %]\n[%\\\n}\npos++\n})\n%]'
            },
        
            
            methods : {
                
                customFunc : function (p1, p2) {
                    return format(p1, p2, this.stash.p3)
                }
            }
        
        })

        //======================================================================================================================================================================================================================================================
        t.diag('Rendering')
        
        t.ok(My.Template({ name1 : 'value1', name2 : 'value2' }) == 'name: [name1], value: [value1]\nvalue: [value2], name: [name2]\n', 'Complex template was rendered correctly')

        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Another formatting style + custom helper method')

        Class('My.Template1', {
            
            meta : 'Shotenjin.Joosed',
            
            template : {
                /*tj
        
                    [%\ var pos = 1; %]
                    [%\ Joose.O.each(stash, function (value, name) { %]
                    [%\     if (pos % 2) { %]
                                [% "name: [" + name + "], value: [" + value + "]\n" %]
                    [%\     } else { %]
                                [% "value: [" + value + "], name: [" + this.upperCaseHelper(name) + "]\n" %]
                    [%\     } %]
                    [%\     pos++ %]
                    [%\ }, this) %]
                
                tj*/

                /* GENERATED BY SHOTENJIN.JOOSED HELPER, DO NOT MODIFY DIRECTLY */
                sources : '[%\\ var pos = 1; %]\n[%\\ Joose.O.each(stash, function (value, name) { %]\n[%\\     if (pos % 2) { %]\n[% "name: [" + name + "], value: [" + value + "]\\n" %]\n[%\\     } else { %]\n[% "value: [" + value + "], name: [" + this.upperCaseHelper(name) + "]\\n" %]\n[%\\     } %]\n[%\\     pos++ %]\n[%\\ }, this) %]'
            },
        
            
            methods : {
                
                upperCaseHelper : function (value) {
                    return value.toUpperCase()
                }
            }
        
        })

        //======================================================================================================================================================================================================================================================
        t.diag('Rendering')
        
        t.ok(My.Template1({ name1 : 'value1', name2 : 'value2' }) == 'name: [name1], value: [value1]\nvalue: [value2], name: [NAME2]\n', 'Complex template was rendered correctly #2 + helper method was called')
        
        
        t.endAsync(async0)
    })
    
})    
