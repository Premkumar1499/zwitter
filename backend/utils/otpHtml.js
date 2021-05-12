exports.registerEmailHtml = (token) => `<div style="background-color: aliceblue; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
Arial, sans-serif;">
<div style="max-width: 350px; background-color: white; padding: 20px; margin: 0 auto;">
    <h2>Confirm your email address</h2>
    <p style="font-size: 18px">There’s one quick step you need to complete before creating your Zwitter account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.</p>
    <p style="font-size: 18px">Please enter this verification code to get started on Zwitter:<p>
    <h1>${token}</h1>
    <p style="font-size: 18px">Verification codes expire after two hours.<p>
    <p style="font-size: 18px">Thanks,</p>
    <p style="font-size: 18px">Zwitter</p>
</div>
  </div>`

exports.passwordEmailHtml = (token, username) => `<div style="background-color: aliceblue; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
  Arial, sans-serif;">
  <div style="max-width: 350px; background-color: white; padding: 20px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p style="font-size: 18px">If you requested a password reset for @${username}, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.</p>
      <h3>${token}</h3>
      <p style="font-size: 18px">Reset password codes expire after two hours.<p>
      <p style="font-size: 18px">Thanks,</p>
      <p style="font-size: 18px">Zwitter</p>
  </div>
    </div>`

exports.registerSmsText = (token) => `\n\n Confirm your phone \n\n Please enter this verification code to get started on Zwitter: ${token} \n\n
Verification codes expire after two hours.\n\nThanks,\nZwitter`

exports.passwordSmsText = (token, username) => `\n\n RESET YOUR PASSWORD \n\n If you requested a password reset for @${username}, use the confirmation code below to complete the process.
 If you didn't make this request, ignore this email. \n\n ${token}
 Reset password codes expire after two hours.\n\nThanks,\nZwitter`