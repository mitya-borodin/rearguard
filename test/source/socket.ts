import { expect } from 'chai';
import * as fs from 'fs';
import 'mocha';
import * as path from 'path';
import socket from '../../src/config/source/socket.config';

const CWD = process.cwd();
const configPath = path.resolve(CWD, 'socket.config.json');

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
  
  describe('Socket, file socket.config.json is not exist.', () => {
    it('Port must be 3000', () => {
      const { socket: { port } } = socket();
      
      expect(port).to.equal('3000');
    });
    
    it('Host must be localhost', () => {
      const { socket: { host } } = socket();
      
      expect(host).to.equal('localhost');
    });
  });
  
  describe('Socket, success case and file socket.config.json exist.', () => {
    beforeEach(() => {
      const config = {
        socket: {
          port: '5000',
          host: 'remote.server.ru'
        }
      };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });
    
    it('Port must be 5000', () => {
      const { socket: { port } } = socket();
      
      expect(port).to.equal('5000');
    });
    
    it('Host must be remote.server.ru', () => {
      const { socket: { host } } = socket();
      
      expect(host).to.equal('remote.server.ru');
    });
  });
  
  describe('Socket, failure case and file socket.config.json exist.', () => {
    beforeEach(() => {
      const config = {
        socket: {
          tttt: 55555,
          host: 11111
        }
      };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });
    
    it('Port must be 3000', () => {
      const { socket: { port } } = socket();
      
      expect(port).to.equal('3000');
    });
    
    it('Host must be localhost', () => {
      const { socket: { host } } = socket();
      
      expect(host).to.equal('localhost');
    });
  });
});
