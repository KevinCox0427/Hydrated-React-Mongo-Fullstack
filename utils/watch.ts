import { resolve } from 'path';
import { spawn, execSync, ChildProcess } from 'child_process';
import { readdirSync, watch } from 'fs';

watchScript();

function watchScript() {
    console.log('Compiling...\n');
    try {
        execSync('tsc');
        execSync('sass styles:dist/public/css');
        execSync('webpack');
    } catch (e:any) {
        console.log(e.output.filter((err:any) => err instanceof Buffer).map((buffer:Buffer) => {
            return `Error:\n\n${buffer.toString()}`
        }).filter((errStr:string) => errStr.length > 'Error:\n\n '.length).join('\n'));
        return;
    }

    let compileTimestamp = Date.now();
    let node = spawn('node', [resolve('dist/server.js')], {stdio: 'inherit'});

    watchDirectory('.', '');
    readDirectorys('.');
    console.log('Watching!\n');

    function watchDirectory(folder:string, pointer:string) {
        watch(folder + '/' + pointer, (x, file) => {
            if(pointer == 'pages' || folder.includes('pages')) {
                runProcess('webpack', file);
            }
            if(file.split('.')[1] == 'scss') runProcess('sass', file);
            if(file.split('.')[1] == 'ts' || file.split('.')[1] == 'tsx') runProcess('tsc', file);
        });
    }

    function readDirectorys(folder:string) {
        readdirSync(folder).forEach(pointer => {
            if(pointer.includes('.') || pointer == 'node_modules' || pointer == 'dist') return;
            watchDirectory(folder, pointer);
            readDirectorys(folder + '/' + pointer);
        }); 
    }

    function runProcess(command: string, fileName: string) {
        if(Date.now() - compileTimestamp < 200) return;
        node.kill('SIGTERM');

        compileTimestamp = Date.now();
        console.log('\nCompiling: ' + fileName);
        let compiler:ChildProcess | null = null;
        
        switch(command){
            case 'webpack':
                compiler = spawn('tsc', {shell: true});
                compiler = spawn('webpack', {shell: true});
                break;
            case 'sass':
                compiler = spawn('sass', ['styles:dist/public/css'], {shell: true});
                break;
            case 'tsc':
                compiler = spawn('tsc', {shell: true}).on('error', e => {console.log(e)});
                break;
        }

        if(!compiler) return;

        compiler.on('exit', () => {
            console.log('Done!\n');
            node = spawn('node', [resolve('dist/server.js')], {stdio: 'inherit'});
        });
    }
}