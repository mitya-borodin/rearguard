import { expect } from 'chai';
import * as fs from 'fs';
import 'mocha';
import * as path from 'path';
import build from '../../src/config/source/build.config';

const CWD = process.cwd();
const configPath = path.resolve(CWD, 'build.config.json');
const essentialConfig = {
  'context': 'src',
  'entry': 'main.js',
  'output': {
    'path': 'dist',
    'publicPath': '/'
  },
  'modules': [
    'src'
  ],
  'css': {
    'isolation': true,
    'reset': {
      'all': 'initial',
      'display': 'block',
      'boxSizing': 'border-box',
      'font-family': 'Avenir Next, -apple-system, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      'font-size': 'inherit'
    },
    'postCssPlugins': 'postCssPlugins.js'
  },
  'isomorphic': {
    'entry': 'server.js',
    'publicDirName': 'public'
  },
  'proxy': {
    '/api': 'http://localhost:5000'
  },
  'typescript': {
    'configPath': 'tsconfig.json',
    'showConfigForIDE': true,
    'config': {
      'compilerOptions': {},
      'compileOnSave': false
    }
  },
  'browserslist': [
    '>0.1%',
    'last 2 versions',
    'not ie <= 11'
  ]
};

describe('Source', () => {
  before(() => {
    process.env.REARGUARD_ERROR_LOG = 'false';
  });
  
  after(() => {
    process.env.REARGUARD_ERROR_LOG = 'true';
  });
  
  afterEach(() => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });
  
  describe('Build, file build.config.json is not exist.', () => {
    
    it('Config must be equal to essential config.', () => {
      expect(JSON.stringify(build(), null, 2)).to.equal(JSON.stringify(essentialConfig, null, 2));
    });
    it('Config file build.config.json must be exist.', () => {
      build();
      
      expect(fs.existsSync(configPath)).to.equal(true);
    });
  });
  describe('Build, success case file build.config.json exist.', () => {
    beforeEach(() => {
      fs.writeFileSync(configPath, JSON.stringify(essentialConfig, null, 2));
    });
    
    it('Config must be equal to essential config.', () => {
      expect(JSON.stringify(build())).to.equal(JSON.stringify(essentialConfig));
    });
  });
  describe('Build, failure case, file build.config.json exist.', () => {
    beforeEach(() => {
      const config = {
        'context': [
          33333
        ],
        'entry': false,
        'output': {
          'path': 100,
          'publicPath': []
        },
        'css': {
          'reset': {
            'all': 'initial',
            'display': 'block',
            'boxSizing': 'border-box',
            'font-family': 34,
            'font-size': 234234
          },
          'postCssPlugins': false
        },
        'isomorphic': {
          'entry': null,
          'publicDirName': NaN
        },
        'proxy': {
          '/api': 44444
        },
        'typescript': {
          
          'showConfigForIDE': 345345,
          'config': {
            'compilerOptions': {},
            
          }
        },
        'browserslist': [
          1,
          1,
          'not ie <= 11'
        ]
      };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });
    
    it('Context must be "src"', () => {
      const { context } = build();
      
      expect(context).to.equal('src');
    });
    it('Entry must be "main.js"', () => {
      const { entry } = build();
      
      expect(entry).to.equal('main.js');
    });
    it('Output, path must be "dist", publicPath must be "/"', () => {
      const { output: { path, publicPath } } = build();
      
      expect(path).to.equal('dist');
      expect(publicPath).to.equal('/');
    });
    it('Modules must be ["src"]', () => {
      const { modules } = build();
      
      expect(JSON.stringify(modules)).to.equal(JSON.stringify(['src']));
    });
    it('CSS must be correct', () => {
      const config = build();
      
      expect(config.css.isolation).to.equal(true);
      expect(config.css.postCssPlugins).to.equal('postCssPlugins.js');
      expect(config.css.reset['font-family']).to.equal(
        'Avenir Next, -apple-system, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif');
      expect(config.css.reset['font-size']).to.equal('inherit');
    });
    it('Isomorphic must be correct', () => {
      const config = build();
      
      expect(config.isomorphic.entry).to.equal('server.js');
      expect(config.isomorphic.publicDirName).to.equal('public');
    });
    it('Proxy must be correct', () => {
      const config = build();
      
      expect(config.proxy['/api']).to.equal('http://localhost:5000');
    });
    it('Typescript must be correct', () => {
      const config = build();
      
      expect(JSON.stringify(config.typescript)).to.equal(JSON.stringify({
        'configPath': 'tsconfig.json',
        'showConfigForIDE': true,
        'config': {
          'compilerOptions': {},
          'compileOnSave': false
        }
      }));
    });
    it('BrowserList must be correct', () => {
      const config = build();
      
      expect(JSON.stringify(config.browserslist)).to.equal(JSON.stringify([
        '>0.1%',
        'last 2 versions',
        'not ie <= 11'
      ]));
    });
  });
});
