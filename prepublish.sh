#!/bin/bash
cwd=$(pwd)
tgdir=$cwd/../prepublish-test

mkdir $tgdir
cd $tgdir

git clone $cwd .
npm i

npm test

cd ..
rm -rf $tgdir
