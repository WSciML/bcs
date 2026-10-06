const article = {
  title: "The Weak Form Is Stronger Than You Think",
  url: "https://www.siam.org/publications/siam-news/articles/the-weak-form-is-stronger-than-you-think/",
};

const c = {
  void: "#050608",
  graphite: "#1c1d20",
  silver: "#e9ebee",
  ash: "#8d929b",
  smoke: "#50545c",
  teal: "#86d3d6",
};

const sans = "'Mona Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const rule = `border-top:1px dotted ${c.smoke};`;
const caps = `font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${c.ash};`;

export const subject = "Thanks for reaching out — Boulder Computational Solutions";

export const text = `Hi there,

Thanks for getting in touch with Boulder Computational Solutions. We've received your message, and someone from our team will follow up soon to learn more about what you're working on.

In the meantime, you might enjoy our SIAM News article on one of the ideas behind our work:

${article.title}
${article.url}

Best,
The team at Boulder Computational Solutions
Boulder, Colorado, USA`;

export const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${c.void};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">We've received your message and will follow up soon.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.void};">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${sans};color:${c.silver};">
        <tr>
          <td style="padding-bottom:20px;${caps}">Boulder Computational Solutions</td>
        </tr>
        <tr><td style="${rule}font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:40px 0 16px;font-size:28px;line-height:1.2;font-weight:500;letter-spacing:-0.01em;color:${c.silver};">Thanks for reaching out.</td>
        </tr>
        <tr>
          <td style="padding-bottom:32px;font-size:16px;line-height:1.6;color:${c.ash};">
            Hi there,
            <br><br>
            We&rsquo;ve received your message, and someone from our team will follow up soon to learn more about what you&rsquo;re working on.
            <br><br>
            In the meantime, you might enjoy our SIAM News article on one of the ideas behind our work.
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:32px;">
            <a href="${article.url}" style="display:block;text-decoration:none;background:${c.graphite};border-radius:6px;padding:20px 22px;">
              <span style="display:block;${caps}padding-bottom:8px;">SIAM News</span>
              <span style="display:block;font-size:18px;line-height:1.35;color:${c.silver};">${article.title}&nbsp;<span style="color:${c.teal};">&rarr;</span></span>
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:40px;font-size:16px;line-height:1.6;color:${c.ash};">
            Best,<br><span style="color:${c.silver};">The team at Boulder Computational Solutions</span>
          </td>
        </tr>
        <tr><td style="${rule}font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding-top:20px;${caps}">Boulder, Colorado, USA</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
