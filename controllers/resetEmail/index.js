import nodemailer from'nodemailer';
export const sendMail=async(reciever,text,subject)=>
{
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    debug:true
});
let mailDetails = {
	from:process.env.EMAIL,
	to: reciever,
	subject: subject,
	html: text
};
mailTransporter.sendMail(mailDetails,(err)=> {
	if(err) {
		console.log("Email does not exist");
	} else {
		console.log('Email sent successfully');
	}
});
}