document.addEventListener('DOMContentLoaded', () => {
    const studentListDiv = document.querySelector('.student-list');
    const exportExcelButton = document.getElementById('exportExcel');
    const titleInput = document.getElementById('titleInput');
    const ratings = {}; // 生徒ごとの評価を保存するオブジェクト

    // 生徒の要素を生成
    for (let i = 1; i <= 40; i++) {
        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');
        studentItem.innerHTML = `<div class="student-number">出席番号 ${i}</div><div class="rating-buttons"></div>`;
        studentListDiv.appendChild(studentItem);

        const ratingButtonsDiv = studentItem.querySelector('.rating-buttons');
        const ratingButtons = [];
        for (let j = 1; j <= 5; j++) {
            const button = document.createElement('button');
            button.classList.add('rating-button');
            button.textContent = j;
            button.dataset.studentId = i;
            button.dataset.rating = j;
            ratingButtonsDiv.appendChild(button);
            ratingButtons.push(button);

            button.addEventListener('click', () => {
                const studentId = button.dataset.studentId;
                const rating = button.dataset.rating;

                // 選択状態のリセット
                ratingButtons.forEach(btn => {
                    btn.classList.remove('selected-1', 'selected-2', 'selected-3', 'selected-4', 'selected-5');
                });

                // 新しい評価を設定または解除
                if (ratings[studentId] === rating) {
                    delete ratings[studentId];
                } else {
                    ratings[studentId] = rating;
                    button.classList.add(`selected-${rating}`);
                }
            });
        }
    }

    // Excel出力機能（ここでは簡単なCSV形式で実装）
    exportExcelButton.addEventListener('click', () => {
        const title = titleInput.value || '生徒評価';
        let csvContent = "出席番号,評価\n";
        for (let i = 1; i <= 40; i++) {
            csvContent += `${i},${ratings[i] || ''}\n`;
        }

        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});