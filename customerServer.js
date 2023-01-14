let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Methods",
"GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD");
res.header("Access-Control-Allow-Headers",
"Origin,X-Requested-With,Content-Type,Accept");
next();
});
var port = process.env.PORT||2410;
app.listen(port,()=> console.log(`Node app listening on port ${port}!`));

let { customerData } = require("./custData.js");
let fs = require("fs");
let fname = "customer.json";

app.get("/resetData",function(req,res){
 let data = JSON.stringify(customerData);
 fs.writeFile(fname,data,function(err){
    if(err) res.status(404).send(err);
    else res.send("Data in file is reset.");
 });
});
app.get("/customers",function(req,res){
  fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
     let customerArray = JSON.parse(data);
     res.send(customerArray);
    } 
  });
});
app.post("/customers",function(req,res){
 let body = req.body;
 fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
     let customerArray = JSON.parse(data);
     let newCustomer = {...body};
     customerArray.push(newCustomer);
     let data1 = JSON.stringify(customerArray);
     fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(newCustomer);
     });
    }
 });
})
app.put("/customers/:id",function(req,res){
 let body = req.body;
 let id = req.params.id;
 fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
     let customerArray = JSON.parse(data);
     let index = customerArray.findIndex((cst)=> cst.id === id);
     if(index>=0){ 
     let updatedCustomer = {...customerArray[index],...body};
     customerArray[index] = updatedCustomer;
     let data1 = JSON.stringify(customerArray);
     fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(updatedCustomer);
     })
     } else res.status(404).send("No customer found");
    }
 });
});
app.delete("/customers/:id",function(req,res){
 let id = req.params.id;
 fs.readFile(fname,"utf8",function(err,data){
  if(err) res.status(404).send(err);
  else {
   let customerArray = JSON.parse(data);
   let index = customerArray.findIndex((cst)=> cst.id===id);
   if(index>=0){
     let deletedCustomer = customerArray.splice(index,1);
     let data1 = JSON.stringify(customerArray);
     fs.writeFile(fname,data1,function(err){
      if(err) res.status(404).send(err);
      else res.send(deletedCustomer);
     });
   }else res.status(404).send("No customer found");
  }
 })
})