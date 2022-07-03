const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
var fs = require("fs");
const bodyParser = require('body-parser');
const app = express();

const { json } = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
const connection = mysql.createConnection({
   host: 'localhost',
    user: 'shuvi',
    password: 'Shuvi1!',
    database: 'pat_database',
});
connection.connect((err)=>{
    if (err) throw err;
    console.log('MYsql connected ....');
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.post('/logintoko',function(req,res){
    
        console.log("Got a POST request");
            // let data = {Username: req.body.nama, Password : req.body.pass};
            // console.log("Got a Post request data="+JSON.stringify(data));
            let username = {Username: req.body.username};
            json.getString
            console.log("Got a Post request data="+JSON.stringify(username.Username));
            let password = {Password: req.body.password};
        console.log("Got a Post request data="+JSON.stringify(password.Password));
            let sql = "SELECT ID_TOKO,NAMA_TOKO FROM user_toko WHERE NAMA_TOKO ='"+username.Username+"' AND PASSWORD = '"+password.Password+"'";
            console.log(sql)
            let query = connection.query(sql,(err,result)=>{
                console.log(JSON.stringify(
                    {"status" : 200, "error" : null, "response" : result}
                    ));
                    if(result !=""){
                        res.send(result)}

                    else{
                        res.send("Login Gagal")}
                    
                });
        
});
app.post('/createtoko',function(req,res){
    let username = {NAMA_TOKO: req.body.username}
    let password = {PASSWORD: req.body.pass}
    let alamat = {ALAMAT_TOKO: req.body.alamat}
    
    let sql = "insert into user_toko(NAMA_TOKO,PASSWORD,ALAMAT_TOKO) VALUES(?,?,?)"
    let query = connection.query(sql,[username.NAMA_TOKO,password.PASSWORD,alamat.ALAMAT_TOKO],(err,resultcheck)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null, "response" : resultcheck}
            ));
            console.log(resultcheck);
        });
    let getid = "select ID_TOKO from user_toko where NAMA_TOKO ='"+username.NAMA_TOKO+"' AND PASSWORD ='"+password.PASSWORD+"'"
    let query1 = connection.query(getid,(err,id)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null, "response" : id}
            ));
            console.log(id[0].ID_TOKO);
            let sql2 = "insert into stok_toko (ID_TOKO, `BERAS`, `MINYAK`, `TELUR`, `GULA`, `GARAM`, `HARGA_BERAS`, `HARGA_MINYAK`, `HARGA_TELUR`, `HARGA_GULA`, `HARGA_GARAM`) VALUES('"+id[0].ID_TOKO+"','0','0','0','0','0','0','0','0','0','0')";
            let query2 = connection.query(sql2,(err,resultcheck)=>{
                console.log(JSON.stringify(
                       {"status" : 200, "error" : null, "response" : resultcheck}
                     ));
                     res.send("penambahan berhasil")
                     console.log(resultcheck);
                   });
        });
    
        
});
app.put('/submittransaksi',function(req,res){
    let idtransaksi = {id: req.body.idtransaksi}

    let sql = "update transaksi set STATUS_ORDER = '1' where NOMER_TRANSAKSI = '"+idtransaksi.id+"'";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
    res.send(result)
    })
});


app.post('/createuser',function(req,res){
    console.log("masuk")
    let username = {Username: req.body.username};
    json.getString
    console.log("Got a Post request data="+JSON.stringify(username.Username));
    let password = {Password: req.body.name};

    console.log("Got a Post request data="+JSON.stringify(password.Password));
    let check = "SELECT ID FROM user WHERE USERNAME ='"+username.Username+"'";

    let checker = connection.query(check,(err,resultcheck)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null, "response" : resultcheck}
            ));
            console.log(resultcheck);
            if (resultcheck == ""){
    let sql = "INSERT INTO user(USERNAME, NAMA) VALUES('"+username.Username+"','"+password.Password+"')";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null, "response" : result}
            ));
            connection.query(check,(err,resultcheck)=>{
                console.log(JSON.stringify(
                    {"status" : 200, "error" : null, "response" : resultcheck}
                    ));
                });
            res.send(resultcheck);
        });
        
    }
    else {

            res.send(resultcheck);
    }  
    });

    
});
app.get('/listtoko',function(req,res){
    let sql = "SELECT NAMA_TOKO,ALAMAT_TOKO FROM user_toko";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
    res.send(result)
    })
});
app.post('/transaksionlineberubah',function(req,res){
    console.log("masuk transaksi online post");
    let nama_toko = {Nama_toko: req.body.nama_toko};
    let username = {Username: req.body.username};
    let alamat = {Alamat: req.body.alamat};
    let beras = {Beras: req.body.bberas};
    let minyak = {Minyak: req.body.bminyak};
    let gula = {Gula: req.body.bgula};
    let telur = {Telur: req.body.btelur};
    let garam = {Garam: req.body.bgaram};
    let total = {Total: req.body.total};
    let alamatlanjut = {alamat: req.body.alamatlanjut}
    let stock = {BERAS: req.body.sberas, GULA: req.body.sgula , TELUR: req.body.stelur, GARAN: req.body.sgaram, MINYAK: req.body.sminyak}

    console.log(stock)
    console.log(total)
    console.log(garam)
    console.log(minyak)
    console.log(telur)
    console.log(gula)
    console.log(beras)

//////////////////////////////////////////////////////

let date_ob = new Date();

// current date
// adjust 0 before single digit date
// let date = ("0" + date_ob.getDate()).slice(-2);

// // current month
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// // current year
// let year = date_ob.getFullYear();

// // current hours
// let hours = date_ob.getHours();

// // current minutes
// let minutes = date_ob.getMinutes();

// // current seconds
// let seconds = date_ob.getSeconds();
// console.log(year + "-" + month + "-" + date);

// // prints date & time in YYYY-MM-DD HH:MM:SS format
// let time =(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// // prints time in HH:MM format
    let name = "select ID from user where USERNAME ='"+username.Username+"'";
    let id = connection.query(name,(err,iduser)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : iduser}
        ));
    console.log(name)
    let nametoko = "select ID_TOKO from user_toko where NAMA_TOKO ='"+nama_toko.Nama_toko+"'";
    let id = connection.query(nametoko,(err,idtoko)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : idtoko}
        ));

        console.log(iduser[0].ID)
        console.log(idtoko[0].ID_TOKO)
        let sql = "INSERT INTO transaksi( PEMBELIAN, ID_TOKO, ID_PEMBELI,ALAMAT_PEMBELI,ALAMAT_LANJUT,BERAS,MINYAK,TELUR,GULA,GARAM,TOTAL,STATUS_ORDER) VALUES('online','"+idtoko[0].ID_TOKO+"','"+iduser[0].ID+"','"+alamat.Alamat+"','"+alamatlanjut.alamat+"','"+beras.Beras+"','"+minyak.Minyak+"','"+telur.Telur+"','"+gula.Gula+"','"+garam.Garam+"','"+total.Total+"','0')";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
        console.log(sql)
        console.log(nametoko)
        let putdata = "update stok_toko set Beras = "+stock.BERAS+",GULA="+stock.GULA+", TELUR="+stock.TELUR+", MINYAK= "+stock.MINYAK+", GARAM ="+stock.GARAN+" where ID_TOKO=?"
        let query1 = connection.query(putdata,[idtoko[0].ID_TOKO],(err,result)=>{
            console.log(JSON.stringify(
                {"status" : 200, "error" : null,"response" : result}
            ));
        console.log(query1)
        res.send("result")  
    })
})

        })

    })
    
});
app.post('/transaksi',function(req,res){
    let user ={Alamat: req.body.alamat, Alamatlanjur: req.body.alamatlanjut , Nama_toko: req.body.nama_toko, Usermame: req.body.username}
    var idtoko
    var iduser
    let belanja = {Beras: req.body.beras, Gula: req.body.gula , Telur: req.body.telur, Garam: req.body.garam, Minyak: req.body.minyak}
    let stock = {Beras: req.body.sberas, Gula: req.body.sgula , Telur: req.body.stelur, Garam: req.body.sgaram, Minyak: req.body.sminyak}
    //let sql = "INSERT INTO transaksi(PEMBELIAN`, ID_TOKO, ID_PEMBELI, ID_PEGAWAI, ALAMAT_PEMBELI, ALAMAT_LANJUT, BERAS, MINYAK, TELUR, GULA, GARAM, TOTAL, STATUS_ORDER) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10],[value-11],[value-12],[value-13],[value-14],[value-15])"
    let name = "select ID_TOKO from user_toko where NAMA_TOKO ='"+user.Nama_toko+"'";

});

app.post('/listtransaksidesktop',function(req,res){
    let  id = {idtoko: req.body.id}
    let sql = "SELECT NOMER_TRANSAKSI,DATE,ALAMAT_PEMBELI,ALAMAT_LANJUT,BERAS,MINYAK,TELUR,GULA,GARAM,TOTAL FROM transaksi where STATUS_ORDER='0' AND ID_TOKO='"+id.idtoko+"'";
    console.log(sql)
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
    res.send(result)
    })
});
app.get('/transaksi',function(req,res){
    let sql = "SELECT * FROM transaksi where STATUS_ORDER='0'";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
    res.send(result)
    })
});
app.post('/transaksionline',function(req,res){
    console.log("masuk transaksi online");
    let username = {Username: req.body.username};
    let name = "select ID from user where USERNAME ='"+username.Username+"'";
    let id = connection.query(name,(err,iduser)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : iduser}
        ));
        console.log(iduser[0].ID)
    let sql = "SELECT DATE,user_toko.NAMA_TOKO,ALAMAT_PEMBELI,BERAS,MINYAK,GULA,TELUR,GARAM,TOTAL FROM transaksi inner join user_toko on transaksi.ID_TOKO = user_toko.ID_TOKO where STATUS_ORDER='0' and ID_PEMBELI='"+iduser[0].ID+"'";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
    res.send(result)
    })})
});
app.put('/transaksi',function(req,res){
    let ACTION ={Action: req.body.action}
    let id = {Transaksi: req.body.nomor_transaksi};
    if (ACTION.Action == "true")
    {
        ACTION.action = 1;
        let sql ="update transaksi set STATUS_ORDER ='1' where NOMER_TRANSAKSI='"+id.Transaksi+"'"; 
        let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
        })
        res.send(sql)
    }
    else{
        res.send("penggantian gagal")
    }

});
app.put('/restock',function(req,res){
    let stock = {Beras: req.body.beras, Gula: req.body.gula , Telur: req.body.telur, Garam: req.body.garam, Minyak: req.body.minyak};
    let harga = {Beras: req.body.hberas, Gula: req.body.hgula , Telur: req.body.htelur, Garam: req.body.hgaram, Minyak: req.body.hminyak};
    let id = {Nama_toko: req.body.nama_toko};
    console.log(stock)
    console.log(harga)
    console.log(id)
    let sql = "UPDATE stok_toko INNER JOIN user_toko on user_toko.ID_TOKO = stok_toko.ID_TOKO SET `BERAS`='"+stock.Beras+"',`MINYAK`='"+stock.Minyak+"',`TELUR`='"+stock.Telur+"',`GULA`='"+stock.Gula+"',`GARAM`='"+stock.Garam+"' ,`HARGA_BERAS`='"+harga.Beras+"',`HARGA_MINYAK`='"+harga.Minyak+"',HARGA_GULA='"+harga.Gula+"',HARGA_GARAM='"+harga.Garam+"',HARGA_TELUR='"+harga.Telur+"' WHERE NAMA_TOKO= '"+id.Nama_toko+"'";
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
        console.log(sql)
        if (result.affectedRows=="0"){
            res.send("gagal melakukan restock")
        }
        else{
            res.send("penggantian data berhasil =")

        }    })
});
app.post('/restock',function(req,res){
    let id = {Nama_toko: req.body.nama_toko};

    let sql = "SELECT user_toko.NAMA_TOKO, stok_toko.ID_TOKO,BERAS,MINYAK,GULA,GARAM,TELUR,HARGA_BERAS,HARGA_MINYAK,HARGA_GULA,HARGA_GARAM,HARGA_TELUR FROM `stok_toko` INNER JOIN `user_toko` on stok_toko.ID_TOKO = user_toko.ID_TOKO WHERE NAMA_TOKO='"+id.Nama_toko+"'";
    console.log(sql)
    let query = connection.query(sql,(err,result)=>{
        console.log(JSON.stringify(
            {"status" : 200, "error" : null,"response" : result}
        ));
        if (result==""){
            res.send("gagal melakukan mengambild data")
        }
        else{
            res.send(result)
    
        } 
    })
    
    
});
app.listen(8000);
console.log('server berjalan di port 8000')