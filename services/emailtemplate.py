def email_temp(msg):
    template = f"""<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Me</title>
        <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet">
        <style>
            body {{ background-color: #ffffff; margin: 0; padding: 0; font-family: sans-serif; }}
            .container {{ max-width: 380px; background: #000000e6; padding: 16px; border-radius: 16px; margin: auto; }}
            .profile-img {{ display: block; width: 90px; height: 90px; border-radius: 50%; background: #444746; padding: 1px; margin: auto; }}
            .heading-1 {{ font-size: 32px; color: #138496; font-family: cursive; font-weight: bold; }}
            .text {{ color: #e4e0e0; font-size: 14px; font-weight: 700; margin-bottom: 10px; }}
            .footer {{ text-align: left; color: #e4e0e0; font-size: 14px; line-height: 23px; margin-top: 20px; }}
            .footer a {{ color: #138496; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://drnull.web.app/"><img class="profile-img" src="https://drnull.web.app/images/profile.png" alt="Profile"></a>
            <p class="text">Name: {msg.get('name', 'N/A')}</p>
            <p class="text">Email: {msg.get('email', 'N/A')}</p>
            <p class="text">Phone: {msg.get('phone', 'N/A')}</p>
            <p class="text">{msg.get('msg', '')}</p>
            <div class="footer">
                <h1 class="heading-1">Hassan</h1>
                <p>Email Me: <a href="mailto:hasanmeady781@gmail.com">hasanmeady781@gmail.com</a></p>
                <p><a href="https://drnull.web.app/">My Website</a></p>
            </div>
        </div>
    </body>
    </html>"""
    return template
