import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,grade} from './questions.js';
test('50 unique questions with valid choices and explanations',()=>{assert.equal(questions.length,50);assert.equal(new Set(questions.map(q=>q.q)).size,50);for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>40);}});
test('grading handles perfect, incorrect and partial answers',()=>{assert.equal(grade(questions.map(q=>q.answer)),50);assert.equal(grade(questions.map(q=>(q.answer+1)%4)),0);const a=questions.map(q=>q.answer);a[0]=null;assert.equal(grade(a),49);assert.equal(grade([]),0);});
