
const path = require("path");
const express = require('express');
const random = require('randomstring');
const db = require("pro.db")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const axios = require("axios")
const db3 = require("./models/shortUrls.js")
const accountdb = require("./models/accounts.js")
const tokensdb = require("./models/tokens.js")

const client = require('twilio')("ACfc23c35cb9e13dfc233b92ebf411c2ec", "f6bce684a1fc17ff212f42f5d5272a16");

class mongo {
  
}

mongo.connect = async function connect() {
   await mongoose.connect("mongodb+srv://botdbuser:jXrdHwMPWhnQ7MMK@cluster0.velgz.mongodb.net/?retryWrites=true&w=majority")
}

  
  



const app = express()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


app.set("view engine", "ejs")


app.get("/test", async (req,res) => {
  await mongo.connect()

  await accountdb.findOne({email: req.query.email}).then(async output => {
    await console.log(output)

    if (output == null) {
      await accountCreate("myzkzn101620@gmail.com","12345678", "Fade", "FADE1", "1pkfpespfepwEFWFodjfsfe")

      return res.send("test2")
    }

    await mongo.connect()

  

      await tokensdb.create({
        code: "2313123123",
        email: req.query.email,
        type: "email confirmation code"
      })

    let tokens = await tokensdb.find()

    

    res.send(tokens)
  })
})


app.get("/api/get_ip", async (req,res) => {

  
  let ip = await axios.get("https://www.cloudflare.com/cdn-cgi/trace")
  res.send({
    ip: ip.data
  })
})

app.get("/dashboard", async (req,res) => {

  let tab = req.query.tab

    if (tab == "url-shrinker")  {
      await mongo.connect().then(async () => {
     const shortUrls = await db3.find()
        const accounts = await accountdb.find()
  res.render(path.join(__dirname, "./website/dash/urlshrinker.ejs"), { shortUrls: shortUrls, accounts: accounts, ip: req.ip })
   })
    }

  

  if (tab == "url-control")  {
      await mongo.connect().then(async () => {
     const shortUrls = await db3.find()
  res.render(path.join(__dirname, "./website/dash/url-control.ejs"), { shortUrls: shortUrls })
   })
    }


  
  await mongo.connect().then(async () => {
     const shortUrls = await db3.find()
  res.render(path.join(__dirname, "./website/dash/dashboard.ejs"), { shortUrls: shortUrls })
   })
   



})




app.get("/api/profiles/edit", (req,res) => {
  
})

app.get("/edit_profile", (req,res) => {
  let action = req.query.a

  if (action == "pfp") {
    res.sendFile(path.join(__dirname, "./website/profile/pfpeditor.html"))
  }

  if (!action) {
    return res.sendFile(path.join(__dirname, "./website/profile/editpage.html"))
    
  }
})





app.get("/call", (req,res) => {
  call()
  res.send("test")
})


app.get("/api/redirect/create", async (req,res) => {
 await mongo.connect().then(async () => {   
   await db3.create({full: req.query.fullUrl})

   res.redirect("/dashboard?tab=url-shrinker")
 })
})



app.get("/api/redirect/delete", async (req,res) => {
 await mongo.connect().then(async () => {   

   await db3.findOne({short: req.query.RedirectShortId}).then (async short => {
     await db3.findOneAndDelete({short: short.short}).then(() => {
     res.status(200).send({
       message: "ok",
       deletedShortId: req.query.RedirectShortId
     })
   })
   })
   
   
   
 })
})




app.get("/avatars/:id/:avatarid.svg", async (req,res) => {
  let userid = req.params.id
  let avatarid = req.params.avatarid

  const fs = require("fs")
  
  let fileExists = fs.existsSync(path.join(__dirname, `./images/pfps/${avatarid}.svg`))

  if (fileExists == true) {
    return res.sendFile(path.join(__dirname, `./images/pfps/${avatarid}.svg`))
  } else {
    return res.send({
      message: "test"
    })
  }
})

app.get("/@me", async (req,res) => {
  res.sendFile(path.join(__dirname, "./website/profile/index.html"))
})

async function accountCreate(email, password, name, username, eccode) {
  const r = require("randomstring")
  const {Database} = require("st.db")
      const db2 = new Database("database.json")

  let id = await r.generate(9)
  let avatarid = await r.generate(30)

  let request = await axios.get("https://source.boringavatars.com")
  
  const fs = require("fs")
  
  await fs.writeFileSync(`./images/pfps/${avatarid}.svg`, request.data)
  
 await accountdb.create({

    email: email,
    pass: password,
    name: name,
    username: username,
    code: eccode,
    userPublicInfo: {
      profileImage: `https://www.shru.ga/avatars/${id}/${avatarid}.svg`,
      id: id
    },
  
  })

  await db2.push("usernames", username)

  
  
  return "account created successfully"
}

app.get("/api/user/:ip/check_login", (req,res) => {
  let ipaddress = req.params.ip


  let account = accountdb.findOne({loggedinuser: ipaddress})


  if (account == null) {
    return res.send({
      message: "not logged in"
    })
  }

  if (account != null) {
    res.send({
      message: "logged in"
    })
  }
})

app.get("/login", (req,res) => {
 res.sendFile(path.join(__dirname, "./website/login/login.html"))
})

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, "./website/home/index.html"))
});

app.listen(3000, () => {
  console.log('server started');
});

app.get("/api/username/check", async (req,res) => {
  let username = req.query.username

  let unames = await db.get("usernames")

  if (unames != null) {
    unames.forEach(uname => {
    if (uname == username) {
      return res.status(200).send({
        s: "true"
      })
    } else {
      return res.status(200).send({
        s: "false"
      })
    }
  })
  }
})


app.get("/api/signupcomplete", async (req,res) => {
  let email = req.query.email
  let name = req.query.name
  let username = req.query.username
  let password = req.query.password
  let code = req.query.emailvcode
  

await mongo.connect()


  
    let acc = await accountCreate(email, password, name, username, code)


  
  if (acc == "account created successfully") {
    res.status(200).send({
    message: "ok"
  })
  }
})



app.get("/api/account/:id/info", (req,res) => {
  let id = req.params.id

  let info = db.get(`${id}.accountInfo`)

  res.status(200).send(info)
})

const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const randomstring = require("randomstring");

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://myproject-de4c3.firebaseio.com",
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service


app.get("/api/emailverify/start_verify", async (req,res) => {
  let code = req.query.code
  let email = req.query.email
  let accesstoken = req.query.token

  

  

  await mongo.connect()

  

      await tokensdb.create({
        code: code,
        email: email,
        type: "email confirmation code"
      })


  const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const msg = {
  to: email, // Change to your recipient
  from: 'emailverify@em536.highbots.ga', // Change to your verified sender
  subject: `Email Verify Email for test`,
  text: 'you can verify your email via this message',
  html: `<h1>Email Confirmation</h1>
        <h2>Hello ${email} Owner</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link:
        https://www.shru.ga/confirm_email?code=${code}</p>
        
        </div>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  

  res.status(200).send({
    message: "ok"
  })
  
})

app.get("/checkpoints/email_verify", (req,res) => {
  res.sendFile(path.join(__dirname, "./website/emailv/pending/evpending.html"))
})

app.get("/signup", (req,res) => {

 res.sendFile(path.join(__dirname, "./website/signup/signup.html"))
})
app.get("/assests/css/alert.css", (req,res) => {
 res.sendFile(path.join(__dirname, "./website/signup/alert.css"))
})
app.get("/assests/css/signup.css", (req,res) => {


  
  
 res.sendFile(path.join(__dirname, "./website/signup/signup.css"))
})
app.get("/assests/js/signup.js", (req,res) => {



  
 res.sendFile(path.join(__dirname, "./website/signup/signup.js"))
})



app.get("/api/email/:address/verify_msg/resend", (req,res) => {
  let address = req.params.address

  let r = randomstring.generate(25)

  res.redirect(`https://www.shru.ga/api/emailverify/start_verify?code=${r}&email=${address}&token=qwfinqwfiqnwfqf5210215ad$`)
})

app.get("/api/accounts/get", async (req,res) => {
  let email = req.query.accountemail
let   id = req.query.accountid
  let ip = req.query.accountuser
  
  
       await mongo.connect()

  if (email) {
         let account = await accountdb.findOne({email: email})

         if (account == null) {
           return res.send({
          account_status: "doesn't exist",
          message: "invalid account"
        })
         } 

        res.send({
          account_status: "exists",
          account_data: account
        })
       }

  if (id) {
         let account = await accountdb.findOne({id: id})

         if (account == null) {
           return res.send({
          account_status: "doesn't exist",
          message: "invalid account"
        })
         } 

        res.send({
          account_status: "exists",
          account_data: account
        })
       }

  if (ip) {
         let account = await accountdb.findOne({loggedinuser: ip})

         if (account == null) {
           return res.send({
          account_status: "doesn't exist",
          message: "invalid account"
        })
         } 

        res.send({
          account_status: "exists",
          account_data: account
        })
       }


})


app.get("/api/user/:ip/login", async (req,res) => {
  let ip = req.params.ip
  let email = req.query.account
  const {Database} = require("st.db")
      const db2 = new Database("database.json")


  let accs = await db.get("accounts")

  if (accs != null) {
    for (const acc of accs) {

      if (acc.loggedinuser) {
        if (acc.loggedinuser == req.ip) {

          await db2.remove("accounts", acc.loggedinuser)
        }
      }
      
      if (acc.email == email) {
        await db2.remove("accounts", acc)
        await db2.push("accounts", {
    email: acc.email,
    pass: acc.pass,
    name: acc.name,
    username: acc.username,
    userPublicInfo: {
      id: acc.userPublicInfo.id,
      profileImage: acc.userPublicInfo.profileImage
    },
    verified: true,
    loggedinuser: ip
  })
      }
    }
  }

  
  res.status(200).send({
    message: "ok"
  })
})

app.post("/api/emailverify/check", (req,res) => {
  let code = req.query.code


  let data = db.get(`${code}.info`)

  if (data.checked == true) {
    res.status(200).send({
      message: "confirmed"
    })
  }

  if (data == null) {
    res.status(200).send({
      message: "unconfirmed"
    })
  }
})

app.get("/confirm_email", async (req,res) => {
  let code = req.query.code

  const {Database} = require("st.db")
      const db2 = new Database("database.json")

  await mongo.connect()

      let data = await tokensdb.findOne({code: code})



  if (data == null) {
        
        return res.sendFile(path.join(__dirname, "./website/emailv/pending/evuncomplete.html"))
      
  }
  
      if (code == data.code) {
        await tokensdb.deleteOne({code: data.code})
       let account = await accountdb.findOne({code: code})
        
          console.log(account)

if (account.code == code) {

  await accountdb.findOneAndUpdate({code: code}, {
    code: null,
    verified: true,
    })
  
  res.sendFile(path.join(__dirname, "./website/emailv/pending/evcomplete.html"))


          
        }
      }

  
  })

app.get("/password_reset", (req,res) => {

  let codeinquery = req.query.code


  if (codeinquery == null) {
    console.log("test")
    return res.sendFile(path.join(__dirname, "./website/passr/index.html"))
  }

  let code = db.get(`${codeinquery}.info`)
  

  if (code == null) {
      return res.sendFile(path.join(__dirname, "./website/passr/ruc.html"))
    
  }
  
  
  if (code) {
    if (code.type == "password reset code") { 
      res.sendFile(path.join(__dirname, "./mdb/index.html"))
  } 
  }
  
  
})

app.get("/api/tokens/delete", (req,res) => {
  let tokeninquery = req.query.token

  let token = db.get(`${tokeninquery}.info`)
if (token) {
  db.delete(`${tokeninquery}.info`)


  res.status(200).send({
    message: "ok"
  })
  
} else {
  res.send({
    message: "invalid token"
  })
}
}) 


app.get("/api/accounts/update", (req,res) => {
  let action = req.query.action
  let accounte = req.query.accountemail

  if (action == "pass_update") {
    let newpass = req.query.newpass


    let accounts = db.get("accounts") 

    if (accounts != null) {
      accounts.forEach(account => {
        if (account.email == accounte) {

          if (account.loggedinuser) {
            db.delete("accounts", account)
          db.push("accounts", {
            email: account.email,
    pass: newpass,
    name: account.name,
    username: account.username,
    id: account.id,
    verified: true,
    loggedinuser: account.loggedinuser
          })
            res.status(200).send({
            message: "ok"
          })
          }
          
          db.delete("accounts", account)
          db.push("accounts", {
            email: account.email,
    pass: newpass,
    name: account.name,
    username: account.username,
    id: account.id,
    verified: true,
          })

          res.status(200).send({
            message: "ok"
          })
        }
      })
    }

    
  }
  if (action == "email_update") {
    
  }
  if (action == "username_update") {
    
  } 
  
})

app.get("/api/tokens/get", (req,res) => {
  let tokeninquery = req.query.token

  let token = db.get(`${tokeninquery}.info`)


  if (!token) {
    return res.status(200).send({
      message: `this token doesn't exist`
    })
  }
   
  if (token) {
    res.status(200).send({
      data: token
    })
  }
  
})

app.get("/api/password/reset/send_email", (req,res) => {
  let email = req.query.address
  let code = req.query.code


  db.set(`${code}.info`, {
    code: code,
    email: email,
    type: "password reset code"
  })

  const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const msg = {
  to: email, // Change to your recipient
  from: 'passreset@em536.highbots.ga', // Change to your verified sender
  subject: `password reset for ${email}`,
  text: 'you can reset your password via this message',
  html: `<h1>Password Reset</h1>
        <h2>Hello ${email} Owner</h2>
        <p>hello, we've got password reset request for this email address, if you are the one who made this request you can reset your password by clicking on the following link:
        https://www.shru.ga/password_reset?code=${code}
        
        but if your are not who made it you can ignore this message</p>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  

  res.status(200).send({
    message: "ok"
  })
  
})

app.get("/assests/css/evc.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/emailv/assests/evc.css"))
})

app.get("/assests/css/evuc.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/emailv/assests/evuc.css"))
})

app.get("/css/mdb.min.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./mdb/css/mdb.min.css"))

})
app.get("/js/mdb.min.js", (req,res) => {
    res.sendFile(path.join(__dirname, "./mdb/js/mdb.min.js"))
  
})

app.get("/assests/css/home.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/home/home.css"))
  
})

app.get("/assests/js/fileuploaderscript.js", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/profile/assests/script.js"))
  
})

app.get("/assests/css/sidebar.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/dash/assests/sidebar.css"))
  
})

app.get("/assests/css/sidebar2.css", (req,res) => {
    res.sendFile(path.join(__dirname, "./website/dash/assests/sidebar2.css"))
  
})
