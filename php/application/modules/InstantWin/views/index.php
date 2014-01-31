<!DOCTYPE html>
<!-- [if IE 7 ]> <html lang="en" class="ie7″> <![endif] -->
<!-- [if IE 8 ]> <html lang="en" class="ie8″> <![endif] -->
<!-- [if IE 9 ]> <html lang="en" class="ie9″> <![endif] -->
<!-- [if (gt IE 9)|!(IE)]> <html lang="en"> <![endif] --> 
<head>
    <base href="<?php echo $_SERVER['HTTP_REWRITEBASE']; ?>" target="_blank"></base>
    <meta charset="utf-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <meta name="viewport" content="user-scalable=0,width=device-width,initial-scale=1,maximum-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico">

    <title>Instant Wins | Fatwin</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="vendor/nprogress/nprogress.css">

    <!-- <link rel="stylesheet" href="/app/css/index.css"> -->

    <!-- Custom styles for this template -->
    <link href="css/instantwin.css" rel="stylesheet">

    <link href="css/main.css" rel="stylesheet">
    <link href="css/matt.css" rel="stylesheet">
    <link href="social/style/css/style.css" rel="stylesheet">
    
    <!-- Winners Feed Styles -->
    <link href="css/jquery.notific8.css" rel="stylesheet">
    <link href="vendor/jquery-custom-scrollbar/jquery.mCustomScrollbar.css" rel="stylesheet">
    <link href="vendor/datepicker/css/datepicker.css" rel="stylesheet">
    <link href="vendor/liquidslider/css/animate.css" rel="stylesheet">
    <link href="vendor/liquidslider/css/liquid-slider.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="vendor/bootstrap/assets/js/html5shiv.js"></script>
    <script src="vendor/bootstrap/assets/js/respond.min.js"></script>
    <script type="text/javascript">window.location.assign('browser.html');</script>
    <![endif]-->
</head>

<body class="cf" id="content">
    <!-- <main role="main" id="main"></main> -->

    <div id="spin-counter"></div>
    <div id="panels-container"></div>
    <div id="mission-control"></div>
    <div id="feed"></div>
    
    <!-- RequireJS -->
    <!-- <script src="vendor/requirejs/require.js" data-main="app/main"></script> -->
    <script type="text/javascript">
        window.currentJob = <?php echo (int) $jobs_no ?>,
        window.gurl = '<?php echo $gurl ?>';
        window.share = <?php echo json_encode($share) ?>;
    </script>
    <script data-main="js/main" src="vendor/requirejs/require.js"></script>

    <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-4568470-9']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    (function() {
        var host = ("https:" == document.location.protocol ? "https://secure.eemt.se" : "http://www.eemt.se");
        document.write(unescape("%3Cscript src='" + host + "/gt/js/4015.js' type='text/javascript'%3E%3C/script%3E"));
    })();
    </script>
</body>
</html>