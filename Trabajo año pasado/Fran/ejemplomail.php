<?php
              require '../phpmailer/PHPMailerAutoload.php';
              $mail = new PHPMailer;    


              //Genero el email de envio
              $mail->isSMTP();                                      // Set mailer to use SMTP
              $mail->Host = 'mail.elitegamingcenter.com';  // Specify main and backup SMTP servers
              $mail->SMTPAuth = true;                               // Enable SMTP authentication
              $mail->Username = '@elitegamingcenter.com';                 // SMTP username
              $mail->Password = '';                           // SMTP password
              $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
              $mail->Port = 587;                                    // TCP port to connect to
              $mail->setFrom('@elitegamingcenter.com', 'Elite Gaming Center');
              $mail->addAddress(''.$mailenvio.'');               // Name is optional
              $mail->addBCC('@elitegamingcenter.com');               // Name is optional
              $mail->addBCC('@elitegamingcenter.com');               // Name is optional
              $mail->addReplyTo('@elitegamingcenter.com');
              $mail->isHTML(true); 
              $mail->Subject = 'Se ha añadido un albaran al pedido '.$pedido.'';
              $mail->Body = '

              ';
              if(!$mail->Send()){
              ?>

              <?php

              }else{

              }   

?>