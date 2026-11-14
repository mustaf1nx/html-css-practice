import {questions,grade} from './questions.js';
const $=id=>document.getElementById(id);
let student='', answers=Array(questions.length).fill(null);
function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function show(id){for(const name of ['intro','quiz','results'])$(name).hidden=name!==id;window.scrollTo(0,0);}
function progress(){const done=answers.filter(a=>a!==null).length;$('progress').value=done;$('progress-text').textContent=`Отвечено: ${done} из ${questions.length}`;}
function renderQuestions(){
 $('questions').replaceChildren();
 questions.forEach((q,i)=>{
  const field=node('fieldset',undefined,'question');field.id=`q-${i}`;
  const legend=node('legend');legend.append(node('span',`${String(i+1).padStart(2,'0')} / ${q.topic}`,'q-meta'),document.createElement('br'),document.createTextNode(q.q));field.append(legend);
  const options=node('div',undefined,'options');
  q.options.forEach((text,j)=>{const label=node('label',undefined,'option');const input=node('input');input.type='radio';input.name=`q${i}`;input.value=String(j);input.addEventListener('change',()=>{answers[i]=j;progress();});label.append(input,node('span',text));options.append(label);});field.append(options);$('questions').append(field);
 });progress();
}
$('start-form').addEventListener('submit',e=>{e.preventDefault();student=$('name').value.trim();if(!student){$('name-error').textContent='Введи имя, чтобы начать.';$('name').focus();return;}$('name-error').textContent='';$('student').textContent=student;answers=Array(questions.length).fill(null);renderQuestions();show('quiz');$('quiz-title').focus();});
$('quiz-form').addEventListener('submit',e=>{e.preventDefault();const missing=answers.findIndex(a=>a===null);if(missing!==-1){$('submit-note').textContent=`Осталось ответить: ${answers.filter(a=>a===null).length}. Выбери ответ в каждом вопросе.`;const field=$(`q-${missing}`);field.scrollIntoView({behavior:'smooth',block:'center'});field.querySelector('input').focus({preventScroll:true});return;}renderResults();});
function renderResults(){
 const total=grade(answers);$('result-title').textContent=`${student}, вот твой результат`;$('score').textContent=`${total} / ${questions.length}`;
 $('result-message').textContent=total===questions.length?'Все ответы верные. Отличная работа!':total>=40?'Хороший результат! Разбери ошибки, чтобы закрепить знания.':'Практика помогает разобраться. Прочитай объяснения и попробуй ещё раз.';
 $('breakdown').replaceChildren();for(const topic of ['HTML','CSS']){const items=questions.map((q,i)=>({q,i})).filter(x=>x.q.topic===topic);const right=items.filter(x=>answers[x.i]===x.q.answer).length;$('breakdown').append(node('span',`${topic}: ${right} из ${items.length}`));}
 $('review').replaceChildren();questions.forEach((q,i)=>{const correct=answers[i]===q.answer;const card=node('article',undefined,`review-card ${correct?'correct':'wrong'}`);card.dataset.correct=String(correct);card.append(node('span',`${i+1} / ${q.topic} · ${correct?'Верно':'Ошибка'}`,'status'),node('h3',q.q),node('p',`Твой ответ: ${q.options[answers[i]]}`));if(!correct)card.append(node('p',`Правильный ответ: ${q.options[q.answer]}`));card.append(node('p',`Почему так: ${q.explanation}`,'explanation'));$('review').append(card);});
 $('errors-only').checked=false;$('no-errors').hidden=true;show('results');$('result-title').focus();
}
$('errors-only').addEventListener('change',()=>{let shown=0;for(const card of $('review').children){card.hidden=$('errors-only').checked&&card.dataset.correct==='true';if(!card.hidden)shown++;}$('no-errors').hidden=shown!==0;});
$('retry').addEventListener('click',()=>{answers=Array(questions.length).fill(null);renderQuestions();$('submit-note').textContent='Можно вернуться к любому вопросу и изменить ответ.';show('quiz');$('quiz-title').focus();});
