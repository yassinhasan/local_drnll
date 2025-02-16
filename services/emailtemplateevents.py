def email_tempevents( message):
    """
    Generates an HTML email template for events.
    
    Args:
        email (str): Recipient's email address.
        subject (str): Email subject.
        message (str): Email message content.
    
    Returns:
        str: Complete HTML email template.
    """
    # Base HTML structure
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <style type="text/css">
            body {{
                width: 100%;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                mso-margin-top-alt: 0px;
                mso-margin-bottom-alt: 0px;
                mso-padding-alt: 0px 0px 0px 0px;
            }}

            p, h1, h2, h3, h4 {{
                margin-top: 0;
                margin-bottom: 0;
                padding-top: 0;
                padding-bottom: 0;
            }}

            .heading-1 {{
                font-size: 32px;
                color: #138496;
                font-family: cursive;
                font-weight: bold;
            }}

            span.preheader {{
                display: none;
                font-size: 1px;
            }}

            html, body {{
                width: 100%;
                height: 100%;
            }}

            tbody {{
                margin-top: 48px;
            }}

            table {{
                font-size: 14px;
                border: 0;
                margin-top: 48px;
            }}

            .links1 {{
                color: #4e72b0;
                margin-right: 8px;
                text-transform: capitalize;
                font-size: 14px;
                font-family: sans-serif;
            }}

            .links2 {{
                color: #138496;
                margin-right: 8px;
                text-transform: capitalize;
                font-size: 14px;
                font-family: sans-serif;
            }}

            .links3 {{
                color: #0b0b0c;
                margin-right: 8px;
                text-transform: capitalize;
                font-size: 14px;
                font-family: sans-serif;
            }}

            @media only screen and (max-width: 640px) {{
                .main-header {{ font-size: 12px !important; }}
                .main-section-header {{ font-size: 28px !important; }}
                .show {{ display: block !important; }}
                .hide {{ display: none !important; }}
                .align-center {{ text-align: center !important; }}
                .no-bg {{ background: none !important; }}
                .main-image img {{ width: 440px !important; height: auto !important; }}
                .divider img {{ width: 440px !important; }}
                .container590 {{ width: 440px !important; }}
                .container580 {{ width: 400px !important; }}
                .main-button {{ width: 220px !important; }}
                .team-img img {{ width: 100% !important; height: auto !important; }}
            }}

            @media only screen and (max-width: 479px) {{
                .main-header {{ font-size: 18px !important; }}
                .main-section-header {{ font-size: 26px !important; }}
                .divider img {{ width: 280px !important; }}
                .container590 {{ width: 280px !important; }}
                .container580 {{ width: 260px !important; }}
            }}
        </style>
    </head>
    <body class="respond" height="100%">
        <table width="380" align="center" style="background-color:#000000e6; padding: 8px 16px; border-radius: 16px;">
            <tbody width="80%">
                <tr align="center">
                    <td align="center" class="section-img" width="80%">
                        <a href="https://drnull.web.app/" target="_blank" style="border-style: none !important; display: block; border: 0 !important;">
                            <img src="https://drnull.web.app/images/profile.png" style="display: block; width: 90px; height: 90px; border-radius: 50%; background: #444746; padding: 1px;" width="90" border="0" alt="" />
                        </a>
                    </td>
                </tr>
                <tr>
                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td width="80%">
                        <div>
                            <span style="color: #e4e0e0 !important; font-size: 14px; font-family: sans-serif; font-weight: 700;"></span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td width="80%">
                        <div>
                            <span style="color: #e4e0e0 !important; font-size: 14px; font-family: sans-serif; font-weight: 700;"></span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td width="80%" style="width: 80%;">
                        <div width="80%" style="width: 80%;">
                            <span style="color: #e4e0e0; font-size: 14px; font-family: sans-serif; font-weight: 700; line-height: 35px;"></span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center">
                        <div style="color: #e4e0e0; font-size: 18px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px; width: 100%;">
                            {message}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                </tr>
                <tr class="hide">
                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                </tr>
                <tr>
                    <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                </tr>
                <tr>
                    <td height="60" style="border-top: 1px solid #e0e0e0; font-size: 60px; line-height: 60px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="left">
                        <h1 class="heading-1">
                            <span class="color-letter">H</span><span style="color: #fbfbfb;">a</span><span style="color: #fbfbfb;">s</span><span style="color: #fbfbfb;">a</span><span style="color: #fbfbfb;">n</span>
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="color: #e4e0e0; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 23px;" class="text_color">
                        <div style="color: #e4e0e0; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; font-weight: 600; mso-line-height-rule: exactly; line-height: 23px;">
                            Email Me: <br />
                            <a href="mailto:" style="color: #e4e0e0; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">hasanmeady781@gmail.com</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <a href="https://drnull.web.app/" style="border-style: none !important; border: 0 !important; color: #138496 !important;" class="links2">My Website</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    """
    return html_template.format(message=message)