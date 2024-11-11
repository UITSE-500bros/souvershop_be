import { config } from 'dotenv'
config()

export const mailTemplate = (token: string) =>
    ` 
    <div style="padding-left:30%;padding-right:30%;padding-top:0">
      <h1 style="font-size:1.875rem;line-height:2.25rem;font-weight:600">Verify your email</h1>
      <p style="margin-bottom:24px">
        First things first: please click the verification link
        below:
      </p>
      <div style="line-height:100%">
<a href="${process.env.APP_URL as string}/verify-email/${token}" style="text-decoration:none;display:inline-block;border-radius:8px;background-color:#0281f1;padding-left:16px;padding-right:16px;padding-top:14px;padding-bottom:14px;text-align:center;font-weight:600;color:white" target="_blank" >
<span>Verify Email Address</span>
</a>
</div>
      <p style="margin-bottom:16px;margin-top:24px">
        Email verification is important because it gives you the
        ability to join an organization. It's also important in
        case you reach out for support through your account … we
        need the correct email address to get back to you!
      </p>
      <p style="margin-bottom:16px;margin-top:24px">
        Keep an eye out for another email from our team with
        resources to help you get started with UIT_SHOP_NOITHAT.
      </p>
      <p style="margin-bottom:16px;margin-top:24px">Cheers,</p>
      <p style="margin-bottom:16px">The UIT_SHOP_NOITHAT Team</p>
  </div>`