import { expect } from 'chai';
import 'mocha';
import socket from '../../src/config/source/socket.config';

describe('Source', () => {
  describe('socket', () => {
    
    it('port must be 3000', () => {
      const { socket: { port } } = socket();
      
      expect(port).to.equal('3000');
    });
  
    it('port must be 3000', () => {
      const { socket: { host } } = socket();
    
      expect(host).to.equal('localhost');
    });
  });
});
