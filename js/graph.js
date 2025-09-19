const wishesButton = document.querySelector('.wishes-button');
const statusDistributionChart = document.getElementById('status-distribution-chart');
const countDynamicsChart = document.getElementById('wish-count-dynamics-chart');
const selectElement = document.getElementById('status-select');
const colors = ['#3498db', '#e67e22', '#2ecc71'];

wishesButton.onclick = function(event) {
    event.preventDefault();

    window.location.href = 'wish.html';
}

async function renderStatusDistributionChart() {
    const ctx = statusDistributionChart.getContext('2d');
    const centerX = statusDistributionChart.width / 2;
    const centerY = statusDistributionChart.height / 2;
    const radius = 100;
    
    let counts = await getCountsByStatus();
    const total = counts.reduce((sum, obj) => sum + obj.count, 0);

    let startAngle = 0;

    counts.forEach(({ count }, index) => {
        const sliceAngle = (count / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = colors[index];
        ctx.fill();

        // Добавляем текст
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + (radius / 2) * Math.cos(textAngle);
        const textY = centerY + (radius / 2) * Math.sin(textAngle);

        ctx.fillStyle = 'black'; // цвет текста
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count, textX, textY);

        startAngle += sliceAngle;
    });

}

async function renderCountDynamicsChart(selectedStatus) {
    const maxBarHeight = countDynamicsChart.offsetHeight;

    countDynamicsChart.innerHTML = '';

    let countsByDate = await getCountsByDate();
    
    const datesLast7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        datesLast7Days.push(d.toISOString().slice(0, 10)); 
    }
    
    const countsByDateMap = new Map();
    countsByDate.forEach(({ date, countsByStatus }) => {
        countsByDateMap.set(date.slice(0, 10), countsByStatus);
    });

    let maxCount = 0;
    
    countsByDate.forEach(({ countsByStatus }) => {
        countsByStatus.forEach(({ status, count }) => {
            if (status === selectedStatus && count > maxCount) {
                maxCount = count;
            }
        });
    });

    datesLast7Days.forEach(dateStr => {
        const countsByStatus = countsByDateMap.get(dateStr) || [];
        const entry = countsByStatus.find(c => c.status === selectedStatus);
        const count = entry ? entry.count : 0;

        const barWrapper = document.createElement('div');
        const bar = document.createElement('div');
        const label = document.createElement('div');

        const height = maxCount > 0 ? (count / maxCount) * maxBarHeight : 0;
        
        label.textContent = formatDateToDDMM(dateStr);
        barWrapper.classList.add('bar-wrapper');
        bar.style.height = height + 'px';
        bar.classList.add('bar');
        label.classList.add('bar-label');

        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);
        countDynamicsChart.appendChild(barWrapper);
    });
}

function formatDateToDDMM(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');     
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    return `${day}.${month}`;
}
selectElement.addEventListener('change', function(event) {
    const status = event.target.value;
    renderCountDynamicsChart(+status)
});

renderStatusDistributionChart();
renderCountDynamicsChart(0);