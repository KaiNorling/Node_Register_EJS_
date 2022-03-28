const express = require("express")
const cookieParser = require("cookie-parser")
const server = express()
const path  = require("path")
const fs = require("fs/promises")
const bcrypt =require("bcrypt")
const { v4 } = require("uuid")
// const db=require("./db.json")


const PORT = process.env.PORT || 2000
server.listen(PORT, ()=> console.log(`SERVER RUNNING ON ${PORT}`))


//
server.set("view engine", "ejs")
server.use(express.json())
server.use(express.urlencoded({extended:true,}))
server.use(cookieParser())




server.get("/", (req,res)=>{
    res.render("index")
})




server.get("/register",(req,res)=>{

    res.render("register")
})

server.post("/register", async(req,res)=>{
    let data = await fs.readFile(path.join(__dirname, "db.json"), "utf-8")
    if(data){
        data = JSON.parse(data)
    }else {
        data=[];
    }
    //data.push(req.body);
    //data.push({...req.body, password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))})
    console.log(req.body);
    data.push({
        id: v4(),
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    });
    
    await fs.writeFile(path.join(__dirname, "db.json"),JSON.stringify(data))
    //console.log(data)
    //console.log(req.body)
    res.render("register")
})



server.get("/login", async(req,res)=>{
    let data = await fs.readFile(path.join(__dirname, "db.json" ),"utf-8")
    data = await JSON.parse(data);
    const user = data.find((e)=>e.username==req.cookies.username)
    if(req.cookies.username && user){
        res.send(`You have already entered ${user.username} ID: ${user.id}`)
    }
    res.render("login")
   

})

server.post("/login", async(req, res)=>{
    let data = await fs.readFile(path.join(__dirname, "db.json" ),"utf-8")
    data = await JSON.parse(data);

    const user = data.find((e)=>e.username===req.body.username);
    console.log(user);
    if(!user){
        res.send("you do not have account")
    }else{
        const isTrust = await bcrypt.compare(req.body.password, user.password)
        console.log(isTrust)
        if(isTrust){
            res.cookie("username", user.username).send(`You have already register MR ${user.username}`)

        }else{
            res.send("wrond password")
        }
    }


})



