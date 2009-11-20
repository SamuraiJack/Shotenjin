###
### $Rev: 46 $
### $Release: 0.0.3 $
### Copyright(c) 2007-2008 kuwata-lab.com all rights reserved
###

require 'test/unit'
#require 'testutil'
#require 'testcase-helper'
require 'assert-text-equal'
require 'fileutils'

require 'tenjin'

class TenjinExamplesTest < Test::Unit::TestCase

  def self.init(path)
    @DIR = File.expand_path(File.dirname(__FILE__) + path)
    @CWD = Dir.pwd()
    Dir.chdir @DIR do
      filenames = []
      filenames += Dir.glob('**/*.result')
      filenames += Dir.glob('**/*.source')
      filenames.each do |filename|
        name = filename.gsub(/[^\w]/, '_')
        s = <<-END
          def test_#{name}
            @name = '#{name}'
            @filename = '#{filename}'
            _test()
          end
        END
        eval s
      end
    end
  end

  def self.DIR; @DIR; end
  def self.CWD; @CWD; end

  self.init('/data/examples')


  def setup
    Dir.chdir self.class.DIR
  end


  def teardown
    Dir.chdir self.class.CWD
  end


  def _test
    @name = (caller()[0] =~ /`(.*?)'/) && $1
    filename = @filename
    d = File.dirname(filename)
    if d != '.'
      Dir.chdir(d)
      filename = File.basename(filename)
      #if test(?f, '../lib/tenjin.js')
      #  FileUtils.cp('../lib/tenjin.js', '.')
      #end
    end
    s = File.read(filename)
    s =~ /\A\$ (.*?)\n/
    command = $1
    expected = $'
    result = `#{command}`
    assert_text_equal(expected, result)
  end


end

