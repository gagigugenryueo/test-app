document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('titleInput');
    const ratingScaleSelect = document.getElementById('ratingScale');
    const tabList = document.getElementById('tabList');
    const studentList = document.getElementById('studentList');
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const exportExcelButton = document.getElementById('exportExcel');

    let ratingScale = 5;
    let currentClass = '7年1組';
    const allRatings = {};

    const createTab = (name) => {
        const tabButton = document.createElement('button');
        tabButton.classList.add('tab-button');
        tabButton.textContent = name;
        tabButton.dataset.class = name;
        tabButton.addEventListener('click', () => {
            currentClass = name;
            updateTabUI();
            renderStudents();
        });
        tabList.insertBefore(tabButton, document.getElementById('addTab'));
        allRatings[name] = allRatings[name] || {};
    };

    const updateTabUI = () => {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.class === currentClass);
        });
    };

    const renderStudents = () => {
        studentList.innerHTML = '';
        const ratings = allRatings[currentClass] || {};
        for (let i = 1; i <= 40; i++) {
            const item = document.createElement('div');
            item.className = 'student-item';

            const numberDiv = document.createElement('div');
            numberDiv.className = 'student-number';
            numberDiv.textContent = `出席番号 ${i}`;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'rating-buttons';

            for (let j = 1; j <= ratingScale; j++) {
                const btn = document.createElement('button');
                btn.className = 'rating-button';
                btn.textContent = j;
                btn.dataset.studentId = i;
                btn.dataset.rating = j;

                if (ratings[i] == j) {
                    btn.classList.add('selected');
                }

                btn.addEventListener('click', () => {
                    ratings[i] = ratings[i] == j ? null : j;
                    renderStudents();
                });

                buttonsDiv.appendChild(btn);
            }

            item.appendChild(numberDiv);
            item.appendChild(buttonsDiv);
            studentList.appendChild(item);
        }
    };

    ratingScaleSelect.addEventListener('change', () => {
        ratingScale = parseInt(ratingScaleSelect.value);
        renderStudents();
    });

    saveButton.addEventListener('click', () => {
        localStorage.setItem('ratingsData', JSON.stringify({ allRatings, currentClass, ratingScale }));
        alert('保存しました');
    });

    loadButton.addEventListener('click', () => {
        const data = localStorage.getItem('ratingsData');
        if (data) {
            const parsed = JSON.parse(data);
            Object.assign(allRatings, parsed.allRatings);
            currentClass = parsed.currentClass || '7年1組';
            ratingScale = parsed.ratingScale || 5;
            ratingScaleSelect.value = ratingScale;
            renderTabs();
            updateTabUI();
            renderStudents();
            alert('読み込み完了');
        } else {
            alert('保存データがありません');
        }
    });

    exportExcelButton.addEventListener('click', () => {
        const title = titleInput.value || '評価';
        const ratings = allRatings[currentClass] || {};
        let csv = '出席番号,評価\n';
        for (let i = 1; i <= 40; i++) {
            csv += `${i},${ratings[i] || ''}\n`;
        }
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}_${currentClass}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    const renderTabs = () => {
        tabList.innerHTML = '';
        Object.keys(allRatings).forEach(name => createTab(name));
        tabList.appendChild(addTab);
        updateTabUI();
    };

    const addTab = document.createElement('button');
    addTab.id = 'addTab';
    addTab.classList.add('tab-button', 'add-tab');
    addTab.textContent = '＋';
    addTab.addEventListener('click', () => {
        const className = prompt('クラス名を入力してください（例：7年3組）');
        if (className && !allRatings[className]) {
            createTab(className);
            currentClass = className;
            updateTabUI();
            renderStudents();
        }
    });

    ['7年1組', '7年2組', '8年1組', '8年2組', '9年1組', '9年2組'].forEach(createTab);
    tabList.appendChild(addTab);

    updateTabUI();
    renderStudents();
});
