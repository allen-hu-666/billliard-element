export class AwaitTest {
    static getIns() {
        if(!this._ins) {
            this._ins = new AwaitTest();
        }
        return this._ins;
    }
    run() {
        //console.log("adsd");
        //this.promise(2515);
        let prom = this.asyncReadFile()
        //console.log(asd);
        prom.then(res=>{
            console.log(res);
        },res=>{
            console.log(res);
        });

    }
    promise(time = 0) {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                console.log("setTimeout:" + time);
                if(time%2 ==0){
                    resolve(time);
                }else {
                    reject(time);
                }
            },time);
        });
    }
    async asyncReadFile() {
        const prom = this.promise;
        let f1;
        try {
            f1 = await prom(1001);
        } catch(e) {
            console.log(e);
        }
        //console.log(f1);
        const f2 = await prom(2000);
        console.log(f2);
        return f2;
    }
}