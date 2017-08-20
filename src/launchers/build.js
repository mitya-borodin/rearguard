import bundle from './bundle';
import clean from './clean';
import copy from './copy';

clean().then(() => copy()).then(() => bundle());
