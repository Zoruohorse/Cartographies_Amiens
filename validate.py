#!/usr/bin/env python3
"""Validation du référentiel documentaire Amiens–Petit-Caux (17 lignes XLSX, 5 onglets)."""
import json,re
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit
root=Path(__file__).resolve().parent
def read(p):return json.loads((root/p).read_text(encoding='utf-8'))
actors,claims,relations,evidence,sources,timeline=[read('data/'+p+'.json') for p in ('actors','claims','relations','evidence','sources','timeline')]
tax=read('config/taxonomy.json');sy=read('data/synthesis.json');ct=read('data/content.json');audit=read('data/audit-amiens1-20261110.json');meta=read('data/meta.json')
def uniq(items,name):
 ids=[x['id'] for x in items];assert len(ids)==len(set(ids)),f'duplicate {name}';return {x['id']:x for x in items}
A=uniq(actors,'actors');C=uniq(claims,'claims');R=uniq(relations,'relations');E=uniq(evidence,'evidence');S=uniq(sources,'sources');T=uniq(timeline,'timeline')
assert len(A)==69 and len(C)==45 and len(R)==91 and len(E)==101 and len(S)==24 and len(T)==45
assert meta['id']=='project_amiens_petit_caux'
assert {c['subject_id'] for c in claims}==set(A)-{'project_amiens_petit_caux'}-{a['id'] for a in actors if a['id'].startswith('entity_')}
for x in evidence:
 assert x['source_id'] in S,x['id']
def qualified(eids,owner):
 assert eids,f'No evidence: {owner}'
 for eid in eids:
  assert eid in E,f'Unknown evidence: {eid}, {owner}'
  url=S[E[eid]['source_id']]['url']
  assert urlsplit(url).scheme in ('http','https') and urlsplit(url).netloc,(owner,eid)
for c in claims:
 assert c['subject_id'] in A and c['project_id']==meta['id'] and c['value'] in tax['stances'],c['id']
 qualified(c['evidence_ids'],c['id'])
for r in relations:
 assert r['source_id'] in A and r['target_id'] in A and r['type'] in tax['relation_types'],r['id']
 qualified(r['evidence_ids'],r['id'])
for x in sy['griefs']+sy['vigilance']+ct['milestones']+ct['fact_sheet']:
 qualified(x['evidence_ids'],x['id'])
stances={c['subject_id']:c['value'] for c in claims}
for t in timeline:
 assert t['actor_id'] in stances and t['event_type']==tax['timeline']['event_type'],t['id']
 assert t['stance']==stances[t['actor_id']] and t['scope'] in ('direct','context'),t['id']
 assert t['category'] in {c['id'] for c in tax['timeline']['categories']},t['id']
 qualified(t['evidence_ids'],t['id'])
 assert t['source_ids'] and all(sid in S for sid in t['source_ids']),t['id']
 if t['status']=='confirmed':
  assert t['date_precision']=='day' and re.fullmatch(r'\d{4}-\d{2}-\d{2}',t['date']),t['id']
  assert date.fromisoformat(t['date'])<=date(2026,11,10),t['id']
 else:assert t['status']=='undated' and t['date'] is None,t['id']
assert sum(x['status']=='confirmed' for x in timeline)==35
assert len(sy['griefs'])==13 and len(sy['vigilance'])==18
assert len(ct['milestones'])==18 and len(ct['fact_sheet'])==10
for milestone in ct['milestones']:
 if milestone['period_precision']=='year':assert re.fullmatch(r'\d{4}',milestone['date'])
 else:assert date.fromisoformat(milestone['date'])
html=(root/'apps/cards/index.html').read_text(encoding='utf-8')
for tab in ('carto','griefs','watch','timeline','evolution'):
 assert f'data-tab="{tab}"' in html and f'id="tab-{tab}"' in html,tab
assert len(re.findall(r'data-tab="[^"]+"',html))==5
for asset in ('assets/js/evolution.js','assets/css/evolution.css','assets/js/cards.js'):assert (root/asset).is_file(),asset
evo=(root/'assets/js/evolution.js').read_text(encoding='utf-8')
for mode in ('new','cumulative','stance'):assert f'data-mode="{mode}"' in evo,mode
for scope in ('direct','all'):assert f'data-scope="{scope}"' in evo,scope
assert audit['resources_reviewed']==17 and len(audit['review'])==17
assert [r['excel_row'] for r in audit['review']]==list(range(2,19))
assert audit['sha256']==meta['source_workbook_sha256']
print('VALIDATION OK : 17 ressources, 16 nouveaux acteurs, 45 positions, 91 relations, 101 preuves, 24 sources, 5 onglets.')
print('ÉVOLUTION : 35 acteurs datés, 10 sans date ; chronologie 18 jalons et 10 repères.')
