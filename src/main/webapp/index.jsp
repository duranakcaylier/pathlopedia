<!DOCTYPE HTML>
<html>
  <head>
    <title>Pathlopedia</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script type="text/javascript" src="/s/jquery.cookie.js"></script>
    <script
       type="text/javascript"
       src="http://maps.googleapis.com/maps/api/js?sensor=false&language=tr&region=TR">
    </script>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
      html { height: 100%; }
      body { height: 100%; margin: 0; padding: 0; background: #000; }
      #map { height: 100%; z-index: 0; position: absolute; }
      #nav { z-index: 1; top: 5px; right: 5px; position: absolute; opacity: 0.8; }
      #signup-title { display:inline-block; margin-top:3px; margin-bottom:3px;
                background-color: #EEF66C; text-align:center; letter-spacing: 5px; cursor: pointer;}
      #signin-title { display:inline-block; margin-top:3px; margin-bottom:3px;
                background-color: #EEF66C; text-align:center; letter-spacing: 5px; cursor: pointer;}
      .text {width: 150px; padding: 2px; padding-left: 4px; padding-right: 4px;
                margin-bottom: 5px; border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px;
                line-height: 130%; font-family: arial,sans-serif; font-size: 8pt;
                color: black;}
      .inputbox {width: 133px; padding: 2px; padding-left: 4px; padding-right: 4px;
                margin-bottom: 5px; border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px;
                line-height: 130%; font-family: arial,sans-serif; font-size: 8pt;
                color: black;}
       a.button {
                background: transparent url('../s/images/bg_button_span.gif') no-repeat scroll top right;
                color: #444;
                display: block;
                float: left;
                font: normal 12px arial, sans-serif;
                height: 24px;
                margin-right: 6px;
                padding-right: 18px; /* sliding doors padding */
                text-decoration: none;
            }

        a.button span {
            background: transparent url('../s/images/bg_button_span.gif') no-repeat;
            display: block;
            line-height: 14px;
            padding: 5px 0 5px 18px;
        }

        a.button:active {
            background-position: bottom right;
            color: #000;
            outline: none; /* hide dotted outline in Firefox */
        }

        a.button:active span {
            background-position: bottom left;
            padding: 6px 0 4px 18px; /* push text down 1px */
        }

        #nav div.c2 { background-color: #99EA93; }
        #clear { clear:both;}
    </style>
  </head>
  <body>
    <div id="map" style="width:100%; height:100%"></div>
    <div id="nav">
        <div id="signin-title" class="text"> SIGN IN </div>
        <div id="signin-block" class="text c2">
          <label for="username">USERNAME</label>
          <input id="username" type="text" class="inputbox">
          <label for="password">PASSWORD</label>
          <input id="password" type="password" class="inputbox">
          <a class="button" href="#"><span>Sign In</span></a>
        </div>
        <div id="clear"></div>
        <div id="signup-title" class="text"> SIGN UP </div>
        <div id="signup-block" class="text c2">
        <label for="signup_username">USERNAME</label>
        <input id="signup_username" type="text" class="inputbox">
        <label for="signup_email">E-MAIL</label>
        <input id="signup_email" type="text" class="inputbox">
        <label for="signup_password">PASSWORD</label>
        <input id="signup_password" type="password" class="inputbox">
        <label for="signup_password_re">RE-TYPE PASSWORD</label>
        <input id="signup_password_re" type="password" class="inputbox">
        <a class="button" href="#"><span>Sign Up</span></a>
        </div>
        <div id="clear"></div>
    </div>
    <script src="/s/main.js" type="text/javascript"></script>
  </body>
</html>
