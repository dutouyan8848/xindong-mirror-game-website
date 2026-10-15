const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const googlePlayLink = document.querySelector('.google-play-link');

const inviteId = new URLSearchParams(window.location.search).get('c');
function decodeInviteUid(inviteCode) {
  if (!/^6[0-35-9]{4,18}$/.test(inviteCode)) return null;

  const digitMap = { '7': '0', '8': '1', '0': '2', '1': '3', '6': '4', '2': '5', '9': '6', '5': '7', '3': '8' };
  const baseNine = [...inviteCode.slice(1)].map((digit) => digitMap[digit]).reverse().join('');
  let encodedValue = 0n;
  for (const digit of baseNine) encodedValue = encodedValue * 9n + BigInt(digit);

  const uid = encodedValue - 729n;
  if (uid <= 0n || uid > 150094635296998391n) return null;

  const transformed = (uid + 729n).toString(9).split('').reverse().join('').padEnd(4, '0')
    .replace(/[0-8]/g, (digit) => '780162953'[Number(digit)]);
  return `6${transformed}` === inviteCode ? uid.toString() : null;
}

const decodedInviteUid = inviteId && decodeInviteUid(inviteId);
if (googlePlayLink && decodedInviteUid) {
  const oneLink = new URL('https://golden-rose-casino.onelink.me/XKYf/c25eytiv');
  oneLink.searchParams.set('pid', 'user_invite');
  oneLink.searchParams.set('c', 'player_invite');
  oneLink.searchParams.set('deep_link_value', 'invite');
  oneLink.searchParams.set('deep_link_sub1', inviteId);
  oneLink.searchParams.set('af_click_lookback', '7d');
  googlePlayLink.href = oneLink.toString();
}

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});
