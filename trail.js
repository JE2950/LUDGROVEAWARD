/* Shared demo store. All data is fictitious. Persists to localStorage. */
(function () {
  if (window.Trail) return;
  const KEY = 'ludgrove-award-demo-v1';

  const CATS = [
    { id: 'service', name: 'Service', values: ['Kindness'], grit: ['Goodwill', 'Integrity'], icon: 'icons/service.svg', blurb: 'Helping other people, in school and beyond.' },
    { id: 'sport', name: 'Sport & Fitness', values: ['Courage'], grit: ['Resilience', 'Tenacity'], icon: 'icons/sport.svg', blurb: 'Trying, training and improving. Open to every boy, not just team players.' },
    { id: 'creative', name: 'Creative', values: ['Curiosity', 'Courage'], grit: [], icon: 'icons/creative.svg', blurb: 'Making, performing and sharing.' },
    { id: 'discovery', name: 'Discovery', values: ['Curiosity'], grit: ['Tenacity'], icon: 'icons/discovery.svg', blurb: 'Asking big questions and finding out.' },
    { id: 'adventure', name: 'Adventure', values: ['Courage'], grit: ['Resilience'], icon: 'icons/adventure.svg', blurb: 'Maps, shelters, nights out and expeditions.' },
    { id: 'life', name: 'Life Skills', values: [], grit: ['Integrity', 'Tenacity', 'Goodwill'], icon: 'icons/life.svg', blurb: 'Looking after yourself and taking responsibility.' }
  ];

  const STAGES = {
    y4: { band: 'y4', years: 'Year 4', trail: 'Foundation', metal: 'Foundation', perCat: 2 },
    y5: { band: 'y5', years: 'Year 5', trail: 'Waymarker', metal: 'Bronze', perCat: 2 },
    y6: { band: 'y6', years: 'Year 6', trail: 'Ridge', metal: 'Silver', perCat: 3 },
    y78: { band: 'y78', years: 'Years 7–8', trail: 'Summit', metal: 'Gold', perCat: 4 }
  };
  const BAND_ORDER = ['y4', 'y5', 'y6', 'y78'];
  const TOP = { trail: 'Pathfinder Award', metal: "Headmaster's Award" };

  const TEMPLATES = {
    service: {
      y4: [{ t: 'Help a new boy find his way for a week' }, { t: 'Make a card for a matron' }],
      y5: [{ t: 'Help run a charity stall', m: 'Amount raised (£)' }, { t: 'Read with a younger boy', m: 'Number of sessions' }],
      y6: [{ t: 'Plan and lead a small fundraiser', m: 'Amount raised (£)' }],
      y78: [{ t: 'Volunteer with a partner school for a term', m: 'Hours given' }, { t: 'Coach younger boys', m: 'Sessions' }]
    },
    sport: {
      y4: [{ t: 'Learn a new sport at Thursday clubs' }, { t: 'Swim a new distance', m: 'Distance (m)' }],
      y5: [{ t: 'Set and track a fitness goal for a half term', m: 'Goal and result' }],
      y6: [{ t: 'Learn to umpire or referee a junior game' }],
      y78: [{ t: 'Co-run a junior tournament' }, { t: 'Train for a personal best', m: 'Before and after' }]
    },
    creative: {
      y4: [{ t: 'Make something in pottery or CDT and explain it' }],
      y5: [{ t: 'Perform or exhibit for the first time' }],
      y6: [{ t: 'Research an artist and make a response' }],
      y78: [{ t: 'Write, direct or curate something for an audience' }, { t: 'Review a performance for the school magazine' }]
    },
    discovery: {
      y4: [{ t: 'Ask a big question and find three answers' }],
      y5: [{ t: 'Visit and report on a museum or lecture' }],
      y6: [{ t: 'Mini research project for the division' }],
      y78: [{ t: 'Independent research project with sources' }]
    },
    adventure: {
      y4: [{ t: 'Find your way round the grounds with a map' }, { t: 'Build a shelter' }],
      y5: [{ t: 'Night camping on site' }],
      y6: [{ t: 'Plan a day route with map and kit list', m: 'Distance (km)' }],
      y78: [{ t: 'Plan an overnight expedition', m: 'Distance (km)' }]
    },
    life: {
      y4: [{ t: 'Pack your own trunk' }, { t: 'Sew on a button' }],
      y5: [{ t: 'Cook a simple dish' }, { t: 'Manage your own kit for a term' }],
      y6: [{ t: 'Plan an exeat activity for the family' }, { t: 'First aid basics' }],
      y78: [{ t: 'Dorm monitor or leadership role' }, { t: 'Budget and organise a club event', m: 'Budget (£)' }]
    }
  };

  const PROMPTS = {
    young: [
      { k: 'what', q: 'What did you do?' },
      { k: 'tricky', q: 'What was tricky?' },
      { k: 'helped', q: 'Who helped you?' }
    ],
    y6: [
      { k: 'aim', q: 'What did you set out to do?' },
      { k: 'wrong', q: 'What went wrong, and what did you try next?' },
      { k: 'gritWhy', q: 'Which GRIT word fits, and why?' }
    ],
    y78: [
      { k: 'differently', q: 'What would you do differently?' },
      { k: 'learned', q: 'What did you learn about yourself?' },
      { k: 'others', q: 'How did this help someone else?' },
      { k: 'next', q: "What's your next challenge?" }
    ]
  };
  const FEELINGS = ['Worried', 'Unsure', 'OK', 'Happy', 'Proud'];
  const GRIT = ['Goodwill', 'Resilience', 'Integrity', 'Tenacity'];
  const EFFORT = ['Stuck with it', 'Tried something hard', "It didn't work first time", 'Second attempt'];

  const STAFF = {
    ashby: { name: 'Mrs C. Ashby', role: 'Division Master, 6B' },
    hollis: { name: 'Mr J. Hollis', role: 'Division Master, 4C' },
    pryce: { name: 'Mr D. Pryce', role: 'Division Master, 8A' },
    grant: { name: 'Mr T. Grant', role: 'Outdoor Education' },
    patel: { name: 'Miss L. Patel', role: 'Art' },
    okafor: { name: 'Mr R. Okafor', role: 'Games' }
  };

  const PUPILS = {
    freddie: { id: 'freddie', first: 'Freddie', surname: 'Ashworth', year: 4, band: 'y4', division: '4C', set: 'Drake', dm: 'hollis', completed: [] },
    kit: { id: 'kit', first: 'Kit', surname: 'Rowe', year: 6, band: 'y6', division: '6B', set: 'Nelson', dm: 'ashby', completed: [{ band: 'y4', date: '2025-07-03' }, { band: 'y5', date: '2026-07-02' }] },
    hugo: { id: 'hugo', first: 'Hugo', surname: 'Fairfax', year: 8, band: 'y78', division: '8A', set: 'Wellington', dm: 'pryce', completed: [{ band: 'y4', date: '2023-07-05' }, { band: 'y5', date: '2024-07-04' }, { band: 'y6', date: '2025-07-03' }] },
    alfie: { id: 'alfie', first: 'Alfie', surname: 'Marsh', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 2, sport: 3, creative: 1, discovery: 1, adventure: 2, life: 1 } },
    barnaby: { id: 'barnaby', first: 'Barnaby', surname: 'Tate', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 1, sport: 1, creative: 2, discovery: 0, adventure: 1, life: 1 } },
    caspar: { id: 'caspar', first: 'Caspar', surname: 'Wolfe', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 3, sport: 2, creative: 2, discovery: 2, adventure: 1, life: 2 } },
    edward: { id: 'edward', first: 'Edward', surname: 'Lyle', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 0, sport: 1, creative: 0, discovery: 1, adventure: 0, life: 0 } },
    george: { id: 'george', first: 'George', surname: 'Hale', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 2, sport: 2, creative: 3, discovery: 1, adventure: 2, life: 2 } },
    jasper: { id: 'jasper', first: 'Jasper', surname: 'Nunn', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 1, sport: 2, creative: 1, discovery: 2, adventure: 1, life: 1 } },
    oscar: { id: 'oscar', first: 'Oscar', surname: 'Pike', year: 6, band: 'y6', division: '6B', dm: 'ashby', counts: { service: 1, sport: 0, creative: 1, discovery: 1, adventure: 2, life: 1 } }
  };

  const PERSONAS = [
    { id: 'freddie', name: 'Freddie', label: 'Freddie · Year 4', role: 'pupil', pupil: 'freddie', home: 'Trail.dc.html', signin: 'QR code card and PIN', note: 'New boy, first year. One task per screen, larger text, dictation.' },
    { id: 'kit', name: 'Kit', label: 'Kit · Year 6', role: 'pupil', pupil: 'kit', home: 'Trail.dc.html', signin: 'Microsoft 365', note: 'Chooses his own supervisor. Reflection required for sign-off.' },
    { id: 'hugo', name: 'Hugo', label: 'Hugo · Year 8', role: 'pupil', pupil: 'hugo', home: 'Trail.dc.html', signin: 'Microsoft 365', note: 'Senior stage, keepsake and top award application.' },
    { id: 'ashby', name: 'Mrs Ashby', label: 'Mrs Ashby · Division Master', role: 'staff', staff: 'ashby', home: 'Division.dc.html', signin: 'Microsoft 365 (staff)', note: 'Approvals, group events and her division at a glance.' },
    { id: 'parent', name: 'Mrs Rowe', label: "Mrs Rowe · Kit's parent", role: 'parent', pupil: 'kit', home: 'Trail.dc.html', signin: 'Through the iSAMS parent portal', note: 'Read-only. Sees signed-off entries only.' }
  ];

  function seed() {
    const E = (id, pupil, cat, title, date, status, extra) => Object.assign({ id, pupil, cat, title, date, status, reflection: {}, effort: [], photo: null, supervisor: PUPILS[pupil].dm, comments: [], own: false, measure: '', starred: false }, extra || {});
    const entries = [
      // Kit, Year 6 (Ridge / Silver)
      E('e1', 'kit', 'service', 'Plan and lead a small fundraiser', '2026-09-12', 'approved', { measure: '£146', reflection: { aim: 'Raise money for the hospice with a cake stall at the Sunday match.', wrong: 'We ran out of change in the first ten minutes. I borrowed a float from Matron and wrote prices bigger.', grit: 'Tenacity', gritWhy: 'I kept the stall going in the rain for the whole second half.' }, effort: ['Stuck with it'], starred: true, comments: [{ by: 'ashby', text: 'Well organised, Kit. The written plan made it easy to help.', date: '2026-09-14' }] }),
      E('e2', 'kit', 'sport', 'Learn to umpire or referee a junior game', '2026-09-18', 'approved', { supervisor: 'okafor', reflection: { aim: 'Referee a Year 4 football match without help.', wrong: 'I missed an offside and the boys argued. I stopped and explained calmly.', grit: 'Integrity', gritWhy: 'I owned up that I got it wrong.' }, effort: ["It didn't work first time"] }),
      E('e3', 'kit', 'adventure', 'Plan a day route with map and kit list', '2026-09-20', 'approved', { supervisor: 'grant', measure: '11 km', reflection: { aim: 'Plan a route through the woods and back along the river.', wrong: 'My timings were too short. Mr Grant showed me Naismith\'s rule.', grit: 'Resilience', gritWhy: 'I re-did the plan twice.' }, effort: ['Second attempt'], starred: true }),
      E('e4', 'kit', 'creative', 'Research an artist and make a response', '2026-09-24', 'submitted', { supervisor: 'ashby', reflection: { aim: 'Find out about Andy Goldsworthy and make a leaf sculpture by the lake.', wrong: 'The wind blew it apart. I pinned the leaves with thorns like he does.', grit: 'Tenacity', gritWhy: 'I built it three times.' }, effort: ['Second attempt', 'Tried something hard'] }),
      E('e5', 'kit', 'life', 'First aid basics', '2026-09-26', 'submitted', { supervisor: 'ashby', reflection: { aim: 'Learn the recovery position and how to call for help.', wrong: 'I forgot to check for breathing first. I practised on Alfie until I got the order right.', grit: 'Goodwill', gritWhy: 'It means I could help someone.' } }),
      E('e6', 'kit', 'discovery', 'Mini research project for the division', '2026-09-15', 'more', { supervisor: 'ashby', reflection: { aim: 'Find out why the lake goes green in summer.', wrong: '', grit: '', gritWhy: '' }, comments: [{ by: 'ashby', text: 'Good topic. Tell me what you tried when the first website disagreed with the book.', date: '2026-09-17' }] }),
      E('e7', 'kit', 'service', 'Help a new boy find his way for a week', '2026-09-08', 'approved', { reflection: { aim: 'Show Freddie round in his first week.', wrong: 'He was homesick on Wednesday. I took him to the Monkey House at break.', grit: 'Goodwill', gritWhy: 'I was kind when he needed it.' } }),
      E('e8', 'kit', 'life', 'Plan an exeat activity for the family', '2026-09-28', 'draft', { reflection: { aim: 'Plan a walk and picnic for exeat.' } }),
      // Freddie, Year 4 (Foundation)
      E('f1', 'freddie', 'life', 'Pack your own trunk', '2026-09-04', 'approved', { reflection: { what: 'I packed my trunk with the list.', tricky: 'Making my games kit fit.', feeling: 'Proud', helped: 'Matron' } }),
      E('f2', 'freddie', 'sport', 'Learn a new sport at Thursday clubs', '2026-09-17', 'approved', { reflection: { what: 'I tried fives.', tricky: 'Hitting the ball with my left hand.', feeling: 'Happy', helped: 'Mr Okafor' } }),
      E('f3', 'freddie', 'adventure', 'Find your way round the grounds with a map', '2026-09-10', 'approved', { reflection: { what: 'I found all six posts.', tricky: 'The one in the woods.', feeling: 'Happy', helped: 'Kit' }, effort: ['Stuck with it'] }),
      E('f4', 'freddie', 'creative', 'Make something in pottery or CDT and explain it', '2026-09-24', 'submitted', { reflection: { what: 'I made a pot for my pencils.', tricky: 'It cracked the first time.', feeling: 'OK', helped: 'Miss Patel' }, effort: ["It didn't work first time"] }),
      // Hugo, Years 7–8 (Summit / Gold)
      ...[
        ['service', 'Volunteer with a partner school for a term', '2025-12-05', '18 hours'], ['service', 'Coach younger boys', '2026-03-12', '8 sessions'], ['service', 'Help at the local school music day', '2026-06-20', ''],
        ['sport', 'Co-run a junior tournament', '2026-05-14', ''], ['sport', 'Train for a personal best', '2026-02-20', '5 km: 26:40 to 23:15'], ['sport', 'Learn to row on the lake', '2025-10-10', ''],
        ['creative', 'Write, direct or curate something for an audience', '2026-03-25', ''], ['creative', 'Review a performance for the school magazine', '2025-11-28', ''],
        ['discovery', 'Independent research project with sources', '2026-06-10', ''], ['discovery', 'Arctic speaker: questions and write-up', '2025-11-14', ''], ['discovery', 'Learn to code a weather logger', '2026-01-30', ''],
        ['adventure', 'Plan an overnight expedition', '2026-06-27', '23 km'], ['adventure', 'Outward Bound trip', '2025-10-03', ''], ['adventure', 'Night navigation in the woods', '2026-02-06', ''],
        ['life', 'Dorm monitor or leadership role', '2026-01-15', ''], ['life', 'Budget and organise a club event', '2026-04-30', '£120']
      ].map((r, i) => E('h' + (i + 1), 'hugo', r[0], r[1], r[2], 'approved', { measure: r[3], supervisor: 'pryce', reflection: { differently: 'Start planning earlier and ask for help sooner.', learned: 'I am calmer under pressure than I thought.', others: 'The younger boys had someone to ask.', next: 'Lead a group rather than just take part.' } })),
      // Other 6B boys awaiting sign-off
      E('o1', 'alfie', 'adventure', 'Plan a day route with map and kit list', '2026-09-27', 'submitted', { supervisor: 'ashby', reflection: { aim: 'Plan a loop to the village and back.', wrong: 'I forgot water on the kit list. Mr Grant asked what I would drink.', grit: 'Resilience', gritWhy: 'I fixed it and walked it.' } }),
      E('o2', 'jasper', 'service', 'Read with a younger boy', '2026-09-25', 'submitted', { supervisor: 'ashby', measure: '6 sessions', reflection: { aim: 'Read with a Year 4 boy every Tuesday.', wrong: 'He did not want to read the book I chose. We swapped to one about pirates.', grit: 'Goodwill', gritWhy: 'I let him choose.' } }),
      E('o3', 'oscar', 'discovery', 'Mini research project for the division', '2026-09-29', 'submitted', { supervisor: 'ashby', reflection: { aim: 'Find out how the school was built in 1892.', wrong: 'The archive was shut. I emailed the archivist and went on Saturday.', grit: 'Tenacity', gritWhy: 'I did not give up when it was shut.' } })
    ];
    // Hugo's two-year highlights for the keepsake
    ['h1', 'h4', 'h9', 'h12', 'h15'].forEach(id => { const e = entries.find(x => x.id === id); e.starred = true; });
    entries.find(e => e.id === 'h12').reflection = { differently: 'Carry less. Our bags were too heavy on day one.', learned: 'I can keep a group going when everyone is tired.', others: 'I helped Max with his blisters and carried his tent poles.', next: 'Help plan next year\'s Year 7 camp.' };
    entries.find(e => e.id === 'h9').reflection = { differently: 'Check my sources earlier.', learned: 'I like finding out things nobody has told me.', others: 'I presented it to the Year 6 division.', next: 'Enter the Exploration Centre science fair.' };

    return {
      v: 1, persona: 'kit', awardName: 'The [Award Name]', tierSet: 'trail', seq: 100,
      entries,
      proposals: [
        { id: 'p1', pupil: 'kit', cat: 'discovery', title: 'Build and monitor a bird box in the woods', why: 'I want to know which birds nest near the lake.', plan: 'Build the box in CDT, put it up with Mr Grant, check it every Sunday for a term and keep a log.', success: 'A log with at least eight weeks of notes and a short talk to the division.', supervisor: 'ashby', status: 'pending', comment: '', date: '2026-09-22' },
        { id: 'p2', pupil: 'hugo', cat: 'service', title: 'Run a Lego club for Year 4 on Thursdays', why: 'Year 4 boys have nothing to do in the second half of clubs.', plan: 'Ask for a room, collect Lego from home, run six sessions.', success: 'Six sessions with at least five boys coming back.', supervisor: 'pryce', status: 'agreed', comment: 'Great idea. Room 4 is free.', date: '2026-01-10' }
      ],
      links: [
        { id: 'l1', token: 'b7d41c09e2a35f86d01b4e7c92a1f3d5', pupil: 'hugo', created: '2026-09-10', expires: '2026-12-09', revoked: false, lastOpened: '2026-09-29T10:12:00', opens: 3, purpose: 'Senior school interview', show: { year: true, set: false, staff: false, photos: false } }
      ],
      topAward: { status: 'draft', statement: '', evidence: [], history: [] },
      audit: [
        { at: '2026-09-29T10:12:00', who: 'Public link', action: 'Share link opened', record: 'Hugo · link l1' },
        { at: '2026-09-14T16:40:00', who: 'Mrs C. Ashby', action: 'Signed off', record: 'Kit · Plan and lead a small fundraiser' },
        { at: '2026-09-10T19:02:00', who: 'Hugo', action: 'Share link created (90 days)', record: 'Hugo · link l1' }
      ]
    };
  }

  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { S = seed(); }
  if (!S || S.v !== 1) S = seed();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn('Could not save demo data', e); }
    window.dispatchEvent(new Event('trail-change'));
  }
  const today = () => new Date().toISOString().slice(0, 10);
  const nid = p => p + (++S.seq);
  function who() { const p = persona(); return p.role === 'staff' ? STAFF[p.staff].name : p.role === 'parent' ? p.name : p.name; }
  function log(action, record) { S.audit.unshift({ at: new Date().toISOString().slice(0, 19), who: who(), action, record }); }

  function persona() { return PERSONAS.find(p => p.id === S.persona) || PERSONAS[1]; }
  function stageName(band) { return STAGES[band][S.tierSet]; }
  function topName() { return TOP[S.tierSet]; }
  function pupilFor() { const p = persona(); return PUPILS[p.pupil || 'kit']; }

  function progress(pupilId) {
    const pu = PUPILS[pupilId]; const st = STAGES[pu.band];
    const approved = S.entries.filter(e => e.pupil === pupilId && e.status === 'approved');
    const cats = CATS.map(c => {
      const done = approved.filter(e => e.cat === c.id).length + ((pu.counts || {})[c.id] || 0);
      return { cat: c, done, need: st.perCat, complete: done >= st.perCat };
    });
    const done = cats.reduce((a, c) => a + Math.min(c.done, c.need), 0);
    const need = st.perCat * CATS.length;
    return { cats, done, need, complete: done >= need, pct: Math.round(done / need * 100) };
  }

  function fmt(d) {
    if (!d) return '';
    const dt = new Date(d.length <= 10 ? d + 'T12:00:00' : d);
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtTime(d) { const dt = new Date(d); return fmt(d) + ', ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
  function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  function token() { const a = new Uint8Array(16); crypto.getRandomValues(a); return Array.from(a, b => b.toString(16).padStart(2, '0')).join(''); }
  function linkState(l) { if (l.revoked) return 'revoked'; if (l.expires < today()) return 'expired'; return 'active'; }

  // Re-encode an image through a canvas: strips EXIF (GPS, device, time) and resizes.
  function cleanImage(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 900, s = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res({ dataUrl: c.toDataURL('image/jpeg', 0.72), originalKb: Math.round(file.size / 1024), w: c.width, h: c.height });
        };
        img.onerror = () => rej(new Error('Not an image'));
        img.src = r.result;
      };
      r.onerror = rej; r.readAsDataURL(file);
    });
  }

  window.Trail = {
    CATS, STAGES, BAND_ORDER, TEMPLATES, PROMPTS, FEELINGS, GRIT, EFFORT, STAFF, PUPILS, PERSONAS,
    get state() { return S; },
    persona, pupilFor, stageName, topName, progress, fmt, fmtTime, today, linkState, cleanImage,
    cat: id => CATS.find(c => c.id === id),
    staffName: id => (STAFF[id] || {}).name || '',
    promptsFor: band => band === 'y78' ? PROMPTS.y78 : band === 'y6' ? PROMPTS.y6 : PROMPTS.young,
    isYoung: band => band === 'y4' || band === 'y5',
    setPersona(id) { S.persona = id; save(); },
    setTierSet(t) { S.tierSet = t; save(); },
    setAwardName(n) { S.awardName = n; save(); },
    reset() { S = seed(); save(); },
    entriesFor: pid => S.entries.filter(e => e.pupil === pid).sort((a, b) => b.date.localeCompare(a.date)),
    addEntry(e) {
      const pu = pupilFor();
      const rec = Object.assign({ id: nid('e'), pupil: pu.id, comments: [], starred: false }, e);
      S.entries.push(rec);
      log(rec.status === 'draft' ? 'Draft saved' : 'Sent for sign-off', pu.first + ' · ' + rec.title);
      save(); return rec.id;
    },
    updateEntry(id, patch) { const e = S.entries.find(x => x.id === id); Object.assign(e, patch); if (patch.status === 'submitted') log('Sent for sign-off', PUPILS[e.pupil].first + ' · ' + e.title); save(); },
    toggleStar(id) { const e = S.entries.find(x => x.id === id); e.starred = !e.starred; save(); },
    approve(ids, comment) {
      ids.forEach(id => { const e = S.entries.find(x => x.id === id); if (!e) return; e.status = 'approved'; if (comment) e.comments.push({ by: persona().staff, text: comment, date: today() }); log('Signed off', PUPILS[e.pupil].first + ' · ' + e.title); });
      save();
    },
    askMore(id, comment) { const e = S.entries.find(x => x.id === id); e.status = 'more'; e.comments.push({ by: persona().staff, text: comment, date: today() }); log('Returned: needs a bit more', PUPILS[e.pupil].first + ' · ' + e.title); save(); },
    groupEvent(cat, title, pupilIds) {
      pupilIds.forEach(pid => S.entries.push({ id: nid('g'), pupil: pid, cat, title, date: today(), status: 'approved', reflection: {}, effort: [], photo: null, supervisor: persona().staff, comments: [], own: false, measure: '', group: true }));
      log('Group event recorded for ' + pupilIds.length + ' boys', title); save();
    },
    addProposal(p) { const pu = pupilFor(); S.proposals.push(Object.assign({ id: nid('p'), pupil: pu.id, status: 'pending', comment: '', date: today() }, p)); log('Own challenge proposed', pu.first + ' · ' + p.title); save(); },
    decideProposal(id, status, comment) { const p = S.proposals.find(x => x.id === id); p.status = status; p.comment = comment || ''; log(status === 'agreed' ? 'Own challenge agreed' : 'Own challenge: changes suggested', PUPILS[p.pupil].first + ' · ' + p.title); save(); },
    createLink(days, show, purpose) {
      const pu = pupilFor();
      const l = { id: nid('l'), token: token(), pupil: pu.id, created: today(), expires: addDays(days), revoked: false, lastOpened: null, opens: 0, purpose: purpose || '', show };
      S.links.unshift(l); log('Share link created (' + days + ' days)', pu.first + ' · link ' + l.id); save(); return l;
    },
    revokeLink(id) { const l = S.links.find(x => x.id === id); l.revoked = true; log('Share link revoked', PUPILS[l.pupil].first + ' · link ' + l.id); save(); },
    updateLinkShow(id, key, val) { const l = S.links.find(x => x.id === id); l.show[key] = val; save(); },
    openLink(tok) {
      const l = S.links.find(x => x.token === tok);
      if (!l) return { state: 'missing' };
      const st = linkState(l);
      if (st === 'active') {
        l.opens++; l.lastOpened = new Date().toISOString().slice(0, 19);
        S.audit.unshift({ at: l.lastOpened, who: 'Public link', action: 'Share link opened', record: PUPILS[l.pupil].first + ' · link ' + l.id });
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      }
      return { state: st, link: l };
    },
    saveTopAward(patch) { Object.assign(S.topAward, patch); save(); },
    submitTopAward() { S.topAward.status = 'submitted'; S.topAward.history.push({ step: 'Application sent', date: today() }); log('Top award application submitted', 'Hugo'); save(); }
  };
  window.dispatchEvent(new Event('trail-ready'));
})();
