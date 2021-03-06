const templateEmail = (link, name) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        html, body{
            margin: 0;
        }
        body{
            background-color: #FFCD61;
            font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        }
        .content{
            margin-top: 10%;
            margin-left: 10%;
            margin-right: 10%;
            position: absolute;
            background-color: #ffff;
            width: 80%;
            height: 80%;
            text-align: center;
            color: #3A3D42;
        }
        img{
            width: 160px;
            margin-top: 20px;
        }
        p{
            font-size: large;
            line-height: 30px;
        }
        
        .footer{
            position:absolute;
            bottom: 5%;
            width: 100%;
        }
        b{
            font-size: 20px;
        }
        .link{
            color: rgb(0, 81, 255);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="content">
        <img src="cid:email" alt="">
        <h2>Verify your email address</h2>
        <p>
            Hi <strong>${name}, </strong> thank you for registering Zembrani <br>
            Please verify this email by clicking button below
        </p>
        <a href="${link}" class="" style="
        margin-top: 40px;
        text-decoration: none;
        display: inline-block;
        width: 230px;
        height: 40px;
        background-color: #FFCD61;
        font-size: large;
        color: black;
        padding-top: 18px;
        border-radius: 10px;
        ">Verify your email</a>
        <div class="footer">
            <b>-------------------------------</b> <br>
        </div>
    </div>
</body>
</html>
`;

module.exports = templateEmail;
