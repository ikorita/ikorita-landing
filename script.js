document.addEventListener('DOMContentLoaded', () => {

    // 1. Alternador de Tema (Dark Mode / Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    // Checa se o usuário já escolheu um tema antes
    const savedTheme = localStorage.getItem('ikorita-theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('ikorita-theme', newTheme);
        updateIcon(newTheme);

        // Atualiza as cores do gráfico se ele existir
        if (window.myChart) {
            window.myChart.options.plugins.legend.labels.color = newTheme === 'dark' ? '#f1f5f9' : '#1e293b';
            window.myChart.update();
        }
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // 2. Efeito Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Efeito Reveal on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Dispara os contadores numéricos quando a seção aparece
                if (entry.target.classList.contains('hero-text')) {
                    startCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 4. Animação de Contadores Numéricos (Ex: 0 a 100%)
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = document.querySelectorAll('.counter');
        const speed = 200; // Velocidade da animação

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // 5. Inicialização do Gráfico (Chart.js)
    const ctx = document.getElementById('triageChart');
    if (ctx) {
        // Obter a cor do texto baseada no tema atual para desenhar o gráfico
        const isDark = body.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#f1f5f9' : '#1e293b';

        window.myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Emergência (Vermelho)', 'Urgência (Amarelo)', 'Pouco Urgente (Verde)'],
                datasets: [{
                    data: [15, 55, 30], // Dados simulados do fluxo hospitalar
                    backgroundColor: [
                        '#ef4444', // Vermelho
                        '#f59e0b', // Amarelo
                        '#10b981'  // Verde
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%', // Deixa o buraco no meio bem elegante
                plugins: {
                    legend: {
                        display: false // Esconde a legenda padrão porque fizemos uma no HTML
                    },
                    tooltip: {
                        padding: 15,
                        bodyFont: { size: 14, family: "'Inter', sans-serif" }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // 6. Efeito Premium de Spotlight/Glow nos Cards (Mouse Tracking)
        const bentoCards = document.querySelectorAll('.bento-card');

        bentoCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const glow = card.querySelector('.card-glow');
                const rect = card.getBoundingClientRect();

                // Calcula a posição exata do cursor em relação ao card
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move o elemento do brilho para seguir o cursor
                glow.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Reseta o brilho quando o mouse sai do card para evitar bugs visuais
            card.addEventListener('mouseleave', () => {
                const glow = card.querySelector('.card-glow');
                glow.style.transform = `translate(-50%, -50%)`;
            });
        });
});