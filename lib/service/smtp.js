var service = module.exports = {};

service.name        = "smtp";
service.composeFile = "smtp.yml";
service.computes    = [ "smtp" ];
service.volumes     = [
    "smtpdata:/var/mail",
    "smtpdata:/etc/postfix/dkim"
];
