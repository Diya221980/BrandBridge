var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
let app = express();



app.listen(2000, function () {
    console.log("success");
});
app.use(express.static("public"));

app.use(express.urlencoded("true"));
app.use(express.json());

app.use(fileuploader());

/*let config = {
    host: "127.0.0.1",
    user: "root",
    password: "belimitless786",
    database: "project",
    dateStrings: true
}*/ 
let config = {
    host: "bpmx9y8e57ittgaydaac-mysql.services.clever-cloud.com",
    user: "ul8lktbkmbhwmrmw",
    password: "4bJrghoqmieL7fKhh6W2",
    database: "bpmx9y8e57ittgaydaac",
    dateStrings: true,
    keepAliveInitialDelay : 10000,
    enableKeepAlive : true,

}
var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected To Database Successfulllyyyy");
    else
        console.log(err.message + "  ########");

})

app.get("/",function(req,resp){
    let path=__dirname+"/public/index2.html";
    resp.sendFile(path);
})
app.get("/infl-dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);

})
app.get("/Partner-dash", function (req, resp) {
    let path = __dirname + "/public/Partner-dash.html";
    resp.sendFile(path);

})
app.get("/infl-profile", function (req, resp) {
    let path = __dirname + "/public/infl-profile.html";
    resp.sendFile(path);
})
app.get("/partner-profile", function (req, resp) {
    let path = __dirname + "/public/partner-profile.html";
    resp.sendFile(path);
})
app.get("/admin-users", function (req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
})
app.get("/admin-dash", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})
app.get("/infl-finder", function (req, resp) {
    let path = __dirname + "/public/infl-finder.html";
    resp.sendFile(path);
})
app.get("/findinfl", function (req, resp) {
    let path = __dirname + "/public/infl-finder.html";
    resp.sendFile(path);
})
app.get("/get-all-influ", function (req, resp) {
    let path = __dirname + "/public/admin-infl-console.html";
    resp.sendFile(path);
})
app.get("/get-all", function (req, resp) {
    mysql.query("Select email,utype,ustatus from users", function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})


app.get("/add", function (req, resp) {
    mysql.query("insert into users values(?, ?, ?, 1)", [req.query.Email, req.query.Pwd, req.query.Utype], function (err) {
        if (err == null) {
            resp.send("Signup Successfully");
        } else {
            resp.send("Email already exists");  
        }
    });
});
app.get("/login-process", function (req, resp) {
    mysql.query("select * from users where email=? and pwd=?", [req.query.txtemail, req.query.txtpwd], function (err,result) {
        if (err == null) {
            console.log(result[0].utype);
            resp.send(result[0].utype); 
        }
        else {
            console.log("err");
            resp.send(err.message);
        }
    })
})
app.post("/save-process", function (req, resp) {
    console.log(req.body);
    //let field=req.body.field;
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else {
        fileName = "nopic.jpg";
    }
    let field = req.body.field;
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.email, req.body.iname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, field.toString(), req.body.insta, req.body.fb, req.body.youtube, fileName], function (err) {
        if (err == null) {
            resp.redirect("result1.html");
        }
        else
            resp.send(err.message);
    })
 
})


app.post("/infl-profile-update", function (req, resp) {
    console.log(req.body);
    //let field=req.body.field; 
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else{
        fileName=req.body.hdn;
    }
     
    let field = req.body.field; 
    mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?,contact=?,field=?,insta=?,fb=?,youtube=?,picpath=? where email=?", [req.body.iname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, field.toString(), req.body.insta, req.body.fb, req.body.youtube, fileName,req.body.email], function (err,result) {
       if(err==null)
       {
        if(result.affectedRows>=1)
        {
            resp.redirect("result1.html");
        }
        else{
            resp.send("Invalid details")
        }
       }
       else
       {
        resp.send(err.message);
       }
    })
 
})
app.get("/post-process", function (req, resp) {
    //console.log(req.query);
    mysql.query("insert into events values(?,?,?,?,?,?)", [req.query.txtemail, req.query.txtevent, req.query.datee, req.query.timee, req.query.txtcity, req.query.txtvenue], function (err) {
        if (err == null)
            resp.send("event posted");
        else
            resp.send(err.message);
    })
})

app.get("/settings-process", function (req, resp) {
    if (req.query.newpass1 === req.query.newpass2) {

        mysql.query("update users set pwd=? where email=? and pwd=?", [req.query.newpass1, req.query.txtemaill, req.query.curpass], function (err, result) {
            if (err == null) {
                if (result.affectedRows >= 1)
                    resp.send("password Updated");

                else
                    resp.send("Wrong details");
            }
            else
                resp.send(err.message);

        })
    }
    else
        resp.send("Don't math");
})
app.get("/del", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
});
app.get("/block", function (req, resp) {
    mysql.query("update users set ustatus=0 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.messsage);
            return;
        }
        resp.send("Blocked");
    })
})
app.get("/resume", function (req, resp) {
    mysql.query("update users set ustatus=1 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
           
            resp.send(err.messsage);
            return;
        }
        resp.send("Resumed");
    })
})
app.get("/delinfl", function (req, resp) {
    mysql.query("delete from iprofile where iname=?", [req.query.iname], function (err, result) {
        if (err != null) {
            console.log(err.message);
            resp.send(err.message);
            return;
        }
        else{
        console.log("deleted");
        resp.send("deleted");
        }
    })
});
app.get("/get-all-infl", function (req, resp) {
    mysql.query("select iname,address,city,contact,field,insta,youtube from iprofile", function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})
app.get("/get-cities", function (req, resp) {
    let field = '%' + req.query.field + '%';
    mysql.query("select distinct city from iprofile where field like ?", [field], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }

        resp.send(result);
    })
})
app.get("/get-cards", function (req, resp) {

    let field = '%' + req.query.field + '%';
    let city = '%' + req.query.city + '%';
    mysql.query("select distinct * from iprofile where field like ? && city like ?", [field, city], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }

        resp.send(result);
     })
})
app.get("/get-by-name",function(req,resp){
    let iname='%'+req.query.iname+'%';
    mysql.query("select distinct * from iprofile where iname like ?",[iname],function(err,result){
        if (err != null) {
            resp.send(err.message);
            return;
        }

        resp.send(result);
    })
})
app.get("/eventmanager", function (req, resp) {
    let path = __dirname + "/public/eventmanager.html";
    resp.sendFile(path);
})

app.get("/events",function(req,resp){
    mysql.query("select * from events where emailid=? and doe>=current_date",[req.query.emailid],function(err,result)
{
    if (err != null) {
        resp.send(err.message);
        return;
    }
    console.log(result);
    resp.send(result);
})
})
app.get("/save-partner-process",function(req,resp){
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.query.cemail,req.query.cname,req.query.ccity,req.query.cstate,req.query.ctype,req.query.ccontact],function(err){
        if (err == null) {
            resp.redirect("result2.html");
        } 
        else
            resp.send(err.message);  
    })

})
app.get("/update-partner-process",function(req,resp){
    mysql.query("update cprofile set cname=?,ccity=?,cstate=?,ctype=?,ccontact=? where cemail=?",[req.query.cname,req.query.ccity,req.query.cstate,req.query.ctype,req.query.ccontact,req.query.cemail],function(err,result){
        if(err==null)
            {
             if(result.affectedRows>=1)
             {
                 resp.redirect("result2.html");
             }
             else{
                 resp.send("Invalid details")
             }
            }
            else
            {
             resp.send(err.message);
            } 
    })
})
app.get("/find-details", function (req, resp) {
    let email = req.query.email;
    console.log("reached");
    mysql.query("select * from iprofile where email=?", [email], function (err, jsonAry) {
        if (err != null) {
            console.log(err.message);
            resp.send(err.message);
            return;
        }
        console.log(jsonAry);
        resp.send(jsonAry);
    })


})

app.get("/mailsend", function (req, resp) {

    mysql.query("select pwd from users where email=?", [req.query.txtemail], function (err, result) {
        if (err != null)
            resp.send(err.message);
        else {
            var nodemailer= require("nodemailer");
            var to = req.query.txtemail;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure:true,
                port:465,   
                auth: {
                    user:'projectbce123@gmail.com',
                    pass:'fonh dvfl icie chvu',
                } 
            })
            console.log("rea") 
            var mailOptions = {
                from: 'projectbce123@gmail.com',
                to: to,
                subject: 'Sending Email using Node.js',
                text: "Your password id " + result[0].pwd,
            };

            transporter.sendMail(mailOptions, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ');
                }
            });
            resp.send(result);
            //console.log(result);
        }
    });
});