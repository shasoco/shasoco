var service = module.exports = {};

service.name = "wordpress";
service.composeFile = "wordpress.yml";
service.otherFiles = [ 'wordpress-php.ini' ];
service.computes = [ "wordpressdb(60)", "wordpressmail", "wordpress" ];
service.volumes = [
    "wordpressdbdata:/var/lib/mysql",
    "wordpressdata:/var/www/html"
];
