// Minimal calendar: renders month grid, clickable days update location.hash
(function(){
function startCalendar(){
  const monthLabel = document.getElementById('monthLabel');
  const calendarEl = document.getElementById('calendar');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const taskDateLabel = document.getElementById('taskDateLabel');
  const tasksList = document.getElementById('tasksList');

  if(!calendarEl) return;

  let view = new Date();
  let selectedDate = new Date();

  function dateKey(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0')+"-"+String(d.getDate()).padStart(2,'0'); }
  function loadTasks(dateStr){ try{ return JSON.parse(localStorage.getItem('tasks-'+dateStr)||'[]'); } catch(e){ return []; } }

  function renderMonth(){
    calendarEl.innerHTML = '';
    monthLabel.textContent = view.toLocaleString(undefined,{month:'long', year:'numeric'});
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    weekdays.forEach(w=>{ const el=document.createElement('div'); el.textContent=w; el.style.fontWeight='600'; el.style.padding='4px'; calendarEl.appendChild(el); });

    const year = view.getFullYear(), month = view.getMonth();
    const first = new Date(year, month, 1); const startDay = first.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    for(let i=prevMonthLastDate - startDay + 1; i<=prevMonthLastDate; i++) appendDay(new Date(year, month-1, i), true);
    for(let d=1; d<=daysInMonth; d++) appendDay(new Date(year, month, d), false);

    const cells = calendarEl.children.length; const needed = Math.ceil(cells/7)*7 - cells;
    for(let i=1;i<=needed;i++) appendDay(new Date(year, month+1, i), true);
  }

  function appendDay(dateObj, otherMonth){
    const el = document.createElement('div'); el.className='cal-day'+(otherMonth?' other-month':'');
    el.textContent = dateObj.getDate();
    const dateStr = dateKey(dateObj);
    const tasks = loadTasks(dateStr);
    if(tasks.length){ const badge = document.createElement('span'); badge.className='cal-badge'; badge.textContent = tasks.length; el.appendChild(badge); }
    const today = new Date(); if(dateObj.getFullYear()===today.getFullYear() && dateObj.getMonth()===today.getMonth() && dateObj.getDate()===today.getDate()) el.classList.add('today');
    el.addEventListener('click', ()=>{ selectedDate = dateObj; renderTasksForSelected(); location.hash = 'date='+dateStr; });
    calendarEl.appendChild(el);
  }

  function renderTasksForSelected(){
    const dateStr = dateKey(selectedDate); taskDateLabel.textContent = selectedDate.toDateString();
    const tasks = loadTasks(dateStr); tasksList.innerHTML='';
    tasks.forEach((t, idx)=>{ const li=document.createElement('li'); if(t.done) li.classList.add('completed'); const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!t.done; cb.addEventListener('change', ()=>{ t.done = cb.checked; localStorage.setItem('tasks-'+dateStr, JSON.stringify(tasks)); renderTasksForSelected(); renderMonth(); }); const span=document.createElement('span'); span.textContent=t.text; const del=document.createElement('button'); del.textContent='✕'; del.style.marginLeft='auto'; del.addEventListener('click', ()=>{ tasks.splice(idx,1); localStorage.setItem('tasks-'+dateStr, JSON.stringify(tasks)); renderTasksForSelected(); renderMonth(); }); li.appendChild(cb); li.appendChild(span); li.appendChild(del); tasksList.appendChild(li); });
  }

  prevBtn.addEventListener('click', ()=>{ view = new Date(view.getFullYear(), view.getMonth()-1, 1); renderMonth(); });
  nextBtn.addEventListener('click', ()=>{ view = new Date(view.getFullYear(), view.getMonth()+1, 1); renderMonth(); });

  renderMonth(); selectedDate = new Date(); renderTasksForSelected();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', startCalendar);
else startCalendar();

})();
