function generateCode() {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}
        return token
      }

function warn(msg) {
           document.getElementById("warn").innerHTML = msg
           $('.alert').addClass("show");
           $('.alert').removeClass("hide");
           $('.alert').addClass("showAlert");
           setTimeout(function(){
             $('.alert').removeClass("show");
             $('.alert').addClass("hide");
           },5000);
         
        }
        
        function removeWarn() {
          $('.alert').removeClass("show");
           $('.alert').addClass("hide");
        }
           


      
async function func() {
  
  let email = document.getElementById("email")
        let pass1 = document.getElementById("password1")
        let pass2 = document.getElementById("password2")
        let name = document.getElementById("name")
        let usern = document.getElementById("username")




  if (!email.value || !pass1.value || !name.value || !usern.value) {
           return warn("please fill all the fields") 
        }
  
 await fetch(`https://www.shru.ga/api/accounts/get?accountemail=${email.value}`).then(async res2 => {
              let r2 = await res2.json()
    
              if (r2.account_status == "exists") {
                return warn("this email already has an account")
              } 
   

    
              
            }).then(async () => {
   await fetch(`https://www.shru.ga/api/username/check?username=${usern.value}`).then(async res => {
    let r = await res.json()

    console.log(r.s)
    console.log(usern.value)

    if (r.s == "true") {
      return warn("this username already exists")
    } else {
    if (r2.account_status == "doesn't exist") {
      let token = generateCode()

  


    await fetch(`https://www.shru.ga/api/signupcomplete?email=${email.value}&name=${name.value}&username=${username.value}&password=${password1.value}&emailvcode=${token}`).then(async re => {
      if (re.status == 200) {


        await fetch(`https://www.shru.ga/api/emailverify/start_verify?code=${token}&token="qwfinqwfiqnwfqf5210215ad$!@!@5"&email=${email.value}`).then(res3 => {
          if (res3.status == 200) {
            location.assign(`https://www.shru.ga/checkpoints/email_verify?email=${email.value}`)
      } else {
        alert("test")
      }
    })
          }
        })
    }
        
        
    

    }
    
  })
            })

  

  
  

  

        if (!email.value.includes("@")) {
         return warn("please add a valid email")
        }

        if (pass1.value.length < 8) {
         return warn("the password must be 8 characters or more")
        }


  if (pass1.value != pass2.value) {
    return warn("Passwords Doesn't Match")
  }

  
  
}