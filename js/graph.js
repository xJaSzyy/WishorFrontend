const wishesButton = document.querySelector('.wishes-button');
const statusDistributionChart = document.getElementById('status-distribution-chart');
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

        startAngle += sliceAngle;
    });
}

const ctx = document.getElementById('wish-count-dynamics-chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель'], // подписи под столбцами
        datasets: [{
            label: 'Количество желаний',
            data: [10, 15, 7, 20],
            backgroundColor: 'lightblue'
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});


renderStatusDistributionChart();