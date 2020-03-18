document.addEventListener('DOMContentLoaded', pageLoading);

function pageLoading() {
  const btnStart = document.querySelector('.btnStart');
  const ul = document.querySelector('ul.taskList');
  const btnOpenAddForm = document.querySelector('.btnOpenAddForm');
  const allFilter = document.querySelector('.allTasks');
  const activeFilter = document.querySelector('.activeTasks');
  const doneFilter = document.querySelector('.doneTasks');
  const priorityFilter = document.querySelector('.priorityTasks');
  const searchField = document.querySelector('.search');
  const btnSearch = document.querySelector('.wrSearch .fa-search');
  const taskStatusTitle = document.querySelector('.taskStatusTitle');
  
  tasks = [];
  filterTasks = [];
  bufTask = [];
  modifiedTask = [];
  
  let key = 0;
  let search = '';
  let state = '';
  
  const returnTaskObj = JSON.parse(localStorage.getItem('myTasks'));
  let returnCountStart = localStorage.getItem('myCountStart');
  
  if(returnTaskObj === null) {
    localStorage.setItem('firstStart', true);  
  } else if(returnTaskObj.length === 0) {
    returnCountStart++;
    localStorage.setItem('myCountStart', returnCountStart);
  } else {
    returnCountStart++;
    localStorage.setItem('myCountStart', returnCountStart);
    tasks = returnTaskObj;
    loadingLocalStorage();
  }

  function loadingLocalStorage() {
    document.querySelector('.startScreen').style.display = 'none';
    document.querySelector('.bodyContent').style.background = '#edf0f5';
    document.querySelector('.wrTasks').style.display = 'block';
    render(tasks);
  }
  
  function onLocalStorage() {
    const taskObj = JSON.stringify(tasks);
    localStorage.setItem('myTasks', taskObj);
  }
  
  function openStartScreen() {
    document.querySelector('.startScreen').style.display = 'flex';
    document.querySelector('.bodyContent').style.background = '#fff';
    document.querySelector('.wrTasks').style.display = 'none';
  }
  
  function onOpenAddForm() {
    let description = '';
    
    const labels = document.querySelectorAll('.wrRadioPriority input');
    for(let i=0; i<labels.length; i++) {
      labels[i].disabled = true;
    }

    const input = document.querySelector('.newTaskName');
    input.addEventListener('change', (e) => {
      description = e.target.value;
      for(let i=0; i<labels.length; i++) {
        labels[i].disabled = false;
      }
    }); 
    
    const radioBtn = document.getElementsByName('priority');
    for(let i=0; i<radioBtn.length; i++) {
      radioBtn[i].addEventListener('change', (e) => {
        bufTask = {id: key, description: description, priority: e.target.value, active: true};
        document.querySelector('.btnAddTask').disabled = false;
      });  
    }
    
    document.getElementById('addForm').removeAttribute('style'); document.getElementById('bd').style.overflow='hidden'; 
    document.querySelector('.overlayAddForm').addEventListener('click', onCloseAddForm);
    document.querySelector('.btnAddTask').addEventListener('click', onCloseAddForm);
    document.querySelector('.btnAddTask').addEventListener('click', createTask);
  }
  
  function onCloseAddForm() {
    const labels = document.querySelectorAll('.wrRadioPriority input');
    
    for(let i=0; i<labels.length; i++) {
      if(labels[i].checked) {
        labels[i].checked = false;
      }
    }
    
    document.querySelector('.btnAddTask').disabled = true;
    document.getElementById('addForm').style.display = 'none'; document.getElementById('bd').style.overflow = 'auto';
    document.querySelector('.newTaskName').value = '';
  }
  
  function renderInFilter() {
    const dataBtnFilter = document.querySelector('.activeBtnFilter').getAttribute('data');
    
    if(dataBtnFilter === 'all') {
      onAllFilter();
    } else if(dataBtnFilter === 'active') {
      onActiveFilter();
    } if(dataBtnFilter === 'done') {
      onDoneFilter();
    } else if(dataBtnFilter === 'priority') {
      onPriorityFilter();
    }
  }
  
  function createTask() {
    document.querySelector('.startScreen').style.display = 'none';
    document.querySelector('.bodyContent').style.background = '#edf0f5';
    document.querySelector('.wrTasks').style.display = 'block';
    
    if(filterTasks.length === 0) {
      if(state === 'filter') {
        tasks.push(bufTask);
        filterTasks.push(bufTask);
        
        renderInFilter();

      } else {
        tasks.push(bufTask);
        render(tasks);
      }
    } else {
      tasks.push(bufTask);
      filterTasks.push(bufTask);
      
      renderInFilter();
    }
    
    bufTask = [];
    key++;
  }
  
  function onActiveTask(e) {
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].id === Number(e.target.parentElement.parentElement.getAttribute('dataId'))) {
        tasks[i].active = !tasks[i].active;
        if(!tasks[i].active) {
          e.target.parentElement.parentElement.classList.add('activeCheck');
        } else e.target.parentElement.parentElement.classList.remove('activeCheck');
      }
    }
    
    renderInFilter();
  }
  
  function onOpenEditForm(e) { 
    modifiedTask.id = Number(e.target.parentElement.parentElement.parentElement.getAttribute('dataId'));

    const input = document.querySelector('.editTaskName');
    input.addEventListener('input', (e) => {
      modifiedTask.description = e.target.value;
      document.querySelector('.btnAcceptEditing').disabled = false;
    }); 
    
    document.getElementById('editForm').removeAttribute('style'); document.getElementById('bd').style.overflow='hidden'; 
    document.querySelector('.overlayEditForm').addEventListener('click', onCloseEditForm);
    document.querySelector('.btnAcceptEditing').addEventListener('click', onCloseEditForm);
    document.querySelector('.btnAcceptEditing').addEventListener('click', editTask);
  };
  
  function onCloseEditForm() {
    document.querySelector('.btnAcceptEditing').disabled = true;
    document.getElementById('editForm').style.display = 'none'; document.getElementById('bd').style.overflow = 'auto';
    document.querySelector('.editTaskName').value = '';
  }
  
  function editTask() {
    if(filterTasks.length === 0) {
      if(state === 'filter') {
        for(let i=0; i<tasks.length; i++) {
          if(tasks[i].id === modifiedTask.id) {
            tasks[i].description = modifiedTask.description;
          }
        }

        for(let i=0; i<filterTasks.length; i++) {
          if(filterTasks[i].id === modifiedTask.id) {
            filterTasks[i].description = modifiedTask.description;
          }
        }
        render(filterTasks);
      } else {
        for(let i=0; i<tasks.length; i++) {
          if(tasks[i].id === modifiedTask.id) {
            tasks[i].description = modifiedTask.description;
          }
        }
        render(tasks);
      }
    } else {
      for(let i=0; i<tasks.length; i++) {
        if(tasks[i].id === modifiedTask.id) {
          tasks[i].description = modifiedTask.description;
        }
      }
      
      for(let i=0; i<filterTasks.length; i++) {
        if(filterTasks[i].id === modifiedTask.id) {
          filterTasks[i].description = modifiedTask.description;
        }
      }
      render(filterTasks);
    }
    
    modifiedTask = [];
  }
  
  function onDeleteTask(e) {
    e.target.parentElement.parentElement.parentElement.remove();

    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].id === Number(e.target.parentElement.parentElement.parentElement.getAttribute('dataId'))) {
        tasks.splice(i, 1);
      }
    }
    
    for(let i=0; i<filterTasks.length; i++) {
      if(filterTasks[i].id === Number(e.target.parentElement.parentElement.parentElement.getAttribute('dataId'))) {
        filterTasks.splice(i, 1);
      }
    }
    
    if(tasks.length === 0) {
      openStartScreen();
    }
  }
  
  function classDeletion() {
    const btnsFilter = document.querySelectorAll('.btnFilter');
    
    for(let i=0; i<btnsFilter.length; i++) {
      btnsFilter[i].classList.remove('activeBtnFilter');
    }  
  }
  
  function onAllFilter() {
    filterTasks = [];
    state = 'filter';
    searchField.value = '';
    taskStatusTitle.innerHTML = 'All Tasks';
    
    classDeletion();
    document.querySelector('.allTasks').classList.add('activeBtnFilter');
    
    for(let i=0; i<tasks.length; i++) {
      filterTasks.push(tasks[i]);
    }
    
    render(filterTasks);
  }
  
  function onActiveFilter() {
    filterTasks = [];
    state = 'filter';
    searchField.value = '';
    taskStatusTitle.innerHTML = 'Active Tasks';
    
    classDeletion();
    document.querySelector('.activeTasks').classList.add('activeBtnFilter');
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].active === true) {
        filterTasks.push(tasks[i]);
      }
    }
    
    render(filterTasks);
  }
  
  function onDoneFilter() {
    filterTasks = [];
    state = 'filter';
    searchField.value = '';
    taskStatusTitle.innerHTML = 'Done Tasks';
    
    classDeletion();
    document.querySelector('.doneTasks').classList.add('activeBtnFilter');
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].active === false) {
        filterTasks.push(tasks[i]);
      }
    }
    
    render(filterTasks);
  }
  
  function onPriorityFilter() { 
    filterTasks = [];
    state = 'filter';
    searchField.value = '';
    taskStatusTitle.innerHTML = 'Priority Tasks';
    
    classDeletion();
    document.querySelector('.priorityTasks').classList.add('activeBtnFilter');
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].active === true && tasks[i].priority === 'high') {
        filterTasks.push(tasks[i]);
      }
    }
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].active === true && tasks[i].priority === 'medium') {
        filterTasks.push(tasks[i]);
      }
    }
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].active === true && tasks[i].priority === 'low') {
        filterTasks.push(tasks[i]);
      }
    }
    
    render(filterTasks);
  }
  
  function onSearch(e) {
    search = e.target.value;
  }
  
  function onSearchSorting() {
    filterTasks = [];
    state = 'filter';
    taskStatusTitle.innerHTML = 'Search Tasks';
    
    classDeletion();
    document.querySelector('.allTasks').classList.add('activeBtnFilter');
    
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].description.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        filterTasks.push(tasks[i]);
      }
    }
    
    render(filterTasks);
  }
  
  function render(obj) {
    const deletedTasks = document.querySelectorAll('li.wrTask');
    
    for(let i=0; i<deletedTasks.length; i++) {
      deletedTasks[i].remove();
    }
    
    for(let i=0; i<obj.length; i++) {
    
      if(obj[i].priority === 'low') {
        classPriority = 'lowPriority';
        labelPriority = 'Low Priority';
      } else if(obj[i].priority === 'medium') {
        classPriority = 'mediumPriority';
        labelPriority = 'Medium Priority';
      } else if(obj[i].priority === 'high') {
        classPriority = 'highPriority';
        labelPriority = 'High Priority';
      }
      
      const li = document.createElement('li');
      li.classList.add('wrTask');
      if(!obj[i].active) { li.classList.add('activeCheck'); }
      li.setAttribute('dataId', obj[i].id);

      const div1 = document.createElement('div');
      div1.classList.add('taskName');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'checkbox' + obj[i].id;
      input.value = 'check' + obj[i].id;
      const label = document.createElement('label');
      label.htmlFor = 'checkbox' + obj[i].id;
      label.innerHTML = obj[i].description;
      label.addEventListener('click', onActiveTask);

      const div2 = document.createElement('div');
      div2.classList.add('priorityTask');
      const div3 = document.createElement('div');
      div3.classList.add('indicatorPriority', classPriority);
      const span = document.createElement('span');
      span.classList.add('labelPriority');
      span.innerHTML = labelPriority;

      const div4 = document.createElement('div');
      div4.classList.add('wrBtnTask');
      const btn1 = document.createElement('button');
      btn1.classList.add('btnEditTask');
      btn1.addEventListener('click', onOpenEditForm);
      const icon1 = document.createElement('i');
      icon1.classList.add('far', 'fa-edit');
      const btn2 = document.createElement('button');
      btn2.classList.add('btnDeleteTask');
      btn2.addEventListener('click', onDeleteTask);
      const icon2 = document.createElement('i');
      icon2.classList.add('fas', 'fa-trash-alt');
      
      ul.append(li);
      li.append(div1, div2, div4);
      div1.append(input, label);
      div2.append(div3, span);
      div4.append(btn1, btn2);
      btn1.append(icon1);
      btn2.append(icon2);
    }
  }
  
  window.addEventListener('beforeunload', onLocalStorage);
  btnStart.addEventListener('click', onOpenAddForm);
  btnOpenAddForm.addEventListener('click', onOpenAddForm);
  allFilter.addEventListener('click', onAllFilter);
  activeFilter.addEventListener('click', onActiveFilter);
  doneFilter.addEventListener('click', onDoneFilter);
  priorityFilter.addEventListener('click', onPriorityFilter);
  searchField.addEventListener('input', onSearch);
  btnSearch.addEventListener('click', onSearchSorting);
}