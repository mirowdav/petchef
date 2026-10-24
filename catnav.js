/*
  PetChef — навигация по каталогу (собаки/кошки, размер, возраст, особенности питания).
  Подключение и правила — см. README.md
*/
(function () {
  var css = ".pc-nav{font-family:inherit;color:#1a1a1a;max-width:1640px;margin:0 auto;padding:0 20px;box-sizing:border-box}\n  .pc-nav *{box-sizing:border-box}\n  .pc-nav__top{display:flex;justify-content:flex-end;margin-bottom:24px}\n  .pc-pills{display:inline-flex;border:1px solid #e3e6ea;border-radius:999px;padding:4px;background:#fff}\n  .pc-pills a{padding:10px 22px;border-radius:999px;text-decoration:none;color:#1a1a1a;font-size:16px}\n  .pc-pills a.is-active{background:#0a66ff;color:#fff}\n  .pc-panel{border:1px solid #e3e6ea;border-radius:28px;padding:28px 34px;background:#fff}\n  .pc-panel__rows{display:flex;gap:32px;flex-wrap:wrap}\n  .pc-group{flex:1 1 360px}\n  .pc-group--size{flex:2 1 560px}\n  .pc-label{font-size:14px;color:#6b7280;margin-bottom:12px}\n  .pc-seg{display:flex;background:#f3f4f6;border-radius:16px;padding:4px;gap:4px}\n  .pc-seg a{flex:1;display:block;padding:12px 18px;border-radius:12px;text-decoration:none;color:#374151;font-size:16px;font-weight:500}\n  .pc-seg a small{display:block;font-size:12px;color:#9ca3af;font-weight:400;margin-top:2px}\n  .pc-seg a.is-active{background:#0a66ff;color:#fff}\n  .pc-seg a.is-active small{color:#dbe8ff}\n  .pc-filters{margin-top:24px;padding-top:20px;border-top:1px solid #e3e6ea}\n  .pc-filters:empty{display:none}\n  .pc-themes-title{font-size:16px;font-weight:600;margin:32px 0 14px}\n  .pc-themes{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}\n  .pc-themes a{display:flex;justify-content:space-between;align-items:center;padding:20px;border:1px solid #e3e6ea;border-radius:16px;background:#f7faf7;text-decoration:none;color:#1a1a1a;font-size:15px}\n  .pc-themes a::after{content:\"→\";color:#6b7280}\n  .pc-themes a.is-active{border-color:#0a66ff;background:#eef4ff}\n  @media (max-width:900px){\n    .pc-panel{padding:18px}\n    .pc-seg{overflow-x:auto}\n    .pc-seg a{flex:0 0 auto;white-space:nowrap}\n    .pc-themes{grid-template-columns:1fr 1fr}\n  }";
  var st = document.createElement('style');
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

(function () {
  // ===================== ТАБЛИЦЫ АДРЕСОВ =====================

  var SIZES = [
    { key: 'all',    title: 'Все породы',     sub: 'любой вес' },
    { key: 'small',  title: 'Мелкие породы',  sub: 'до 5,5 кг' },
    { key: 'medium', title: 'Средние породы', sub: 'от 6 до 15 кг' },
    { key: 'large',  title: 'Крупные породы', sub: 'от 15 кг' }
  ];

  var AGES = {
    dog: [
      { key: 'any',   title: 'Любой возраст' },
      { key: 'adult', title: 'Взрослые', sub: 'от 1 года' },
      { key: 'young', title: 'Щенки',    sub: 'до 1 года' }
    ],
    cat: [
      { key: 'any',   title: 'Любой возраст' },
      { key: 'adult', title: 'Взрослые', sub: 'от 1 года' }
      // котята: раскомментировать, если страница нужна
      // ,{ key: 'young', title: 'Котята', sub: 'до 1 года' }
    ]
  };

  // животное → размер → возраст → адрес
  var GRID = {
    dog: {
      all:    { any: '/catalog/korm-dlya-sobak',          // НОВАЯ
                adult: '/catalog/adults',
                young: '/catalog/puppies' },
      small:  { any: '/catalog/melkieporodi',
                adult: '/catalog/melkieporodi/adults',    // НОВАЯ
                young: '/catalog/melkieporodi/puppies' }, // НОВАЯ
      medium: { any: '/catalog/srednieporodi',
                adult: '/catalog/srednieporodi/adults',   // НОВАЯ
                young: '/catalog/srednieporodi/puppies' },// НОВАЯ
      large:  { any: '/catalog/krupnieporodi',
                adult: '/catalog/krupnieporodi/adults',   // НОВАЯ
                young: '/catalog/krupnieporodi/puppies' } // НОВАЯ
    },
    cat: {
      all:    { any: '/catalog/korm-dlya-koshek',
                adult: '/catalog/korm_dly_vzroslyh_koshek',
                young: '/catalog/korm_dly_kotyt' }
    }
  };

  // тематические страницы: у каждой есть пара для другого животного
  var THEMES = [
    { key: 'grainfree', title: 'Беззерновой',
      dog: '/catalog/korm-bezzernovoi',
      cat: '/catalog/korm-bezzernovoi-dlya-koshek' },                // НОВАЯ
    { key: 'castrated', title: 'Для кастрированных',
      dog: '/catalog/korm-dlya-kastrirovannix-sobak',
      cat: '/catalog/korm_dly_kastrirovannyh_kotov' },
    { key: 'sterilized', title: 'Для стерилизованных',
      dog: '/catalog/korm-dlya-sterilizovannix-sobak',
      cat: '/catalog/korm_dly_sterilizovannyh_kotov' },
    { key: 'sensitive', title: 'Чувствительное пищеварение',
      dog: '/catalog/korm-dlya-s-schuvstvitelinimpesch-sobak',
      cat: '/catalog/korm_dly_kotov_s_chuvstvitelnym_pishevareniem' }
  ];

  var BREEDS = {
    dog: ['/catalog/aussi', '/catalog/bigl', '/catalog/bokser', '/catalog/velsh-korgi-pembrok',
          '/catalog/doberman', '/catalog/djek-rassel-teryer', '/catalog/yorkshirskiy-teryer',
          '/catalog/kavaler-king-charlz-spaniel', '/catalog/kurcxaar', '/catalog/labrador',
          '/catalog/nemeckaya-ovcharka', '/catalog/shpic', '/catalog/pudel', '/catalog/rotveler',
          '/catalog/sibirski-xaski', '/catalog/taksa', '/catalog/francuzskii-buldog',
          '/catalog/chikhuakhua', '/catalog/shi-tcu'],
    cat: ['/catalog/bengal', '/catalog/britanskie', '/catalog/mein-kun', '/catalog/sibirskie',
          '/catalog/sfinks', '/catalog/vislouxie']
  };

  // Перенести родной фильтр Tilda (тип рациона, вкус) внутрь панели.
  // Класс внутренний — проверьте на тестовой странице. null = не переносить.
  var TILDA_FILTER_SELECTOR = '.t-store__filter';

  // ===================== ЛОГИКА =====================

  function norm(p) {
    p = decodeURIComponent(p || '/').toLowerCase().replace(/\/+$/, '');
    return p || '/';
  }

  // Определяем, что за страница открыта
  function detect(path) {
    var a, s, g;
    for (a in GRID) for (s in GRID[a]) for (g in GRID[a][s])
      if (norm(GRID[a][s][g]) === path) return { kind: 'grid', animal: a, size: s, age: g };
    for (var i = 0; i < THEMES.length; i++)
      for (a in { dog: 1, cat: 1 })
        if (THEMES[i][a] && norm(THEMES[i][a]) === path) return { kind: 'theme', animal: a, theme: THEMES[i].key };
    for (a in BREEDS)
      if (BREEDS[a].map(norm).indexOf(path) !== -1) return { kind: 'breed', animal: a };
    return null;
  }

  function link(href, html, active) {
    return '<a href="' + href + '"' + (active ? ' class="is-active"' : '') + '>' + html + '</a>';
  }
  function label(item) {
    return item.title + (item.sub ? '<small>' + item.sub + '</small>' : '');
  }

  function render(root, page) {
    var a = page.animal, other = a === 'dog' ? 'cat' : 'dog', html = '';

    // Собаки / Кошки — ведём на страницу-пару
    function animalHref(target) {
      if (target === a) return '#';
      if (page.kind === 'theme') {
        var t = THEMES.filter(function (x) { return x.key === page.theme; })[0];
        if (t && t[target]) return t[target];
      }
      return GRID[target].all.any;
    }
    html += '<div class="pc-nav__top"><div class="pc-pills">' +
      link(animalHref('dog'), 'Для собак', a === 'dog') +
      link(animalHref('cat'), 'Для кошек', a === 'cat') +
      '</div></div>';

    html += '<div class="pc-panel">';

    // Размер/возраст как навигация — только на страницах каталога
    if (page.kind === 'grid') {
      html += '<div class="pc-panel__rows">';
      if (a === 'dog') {
        html += '<div class="pc-group pc-group--size"><div class="pc-label">Размер собаки</div><div class="pc-seg">';
        SIZES.forEach(function (s) {
          var row = GRID[a][s.key];
          if (!row) return;
          // тот же возраст, другой размер; если такой страницы нет — «любой возраст»
          html += link(row[page.age] || row.any, label(s), s.key === page.size);
        });
        html += '</div></div>';
      }
      html += '<div class="pc-group"><div class="pc-label">Возраст</div><div class="pc-seg">';
      AGES[a].forEach(function (g) {
        var href = GRID[a][page.size][g.key];
        if (href) html += link(href, label(g), g.key === page.age);
      });
      html += '</div></div></div>';
    }

    html += '<div class="pc-filters" id="pc-filters-slot"></div></div>';

    // Особенности питания
    html += '<div class="pc-themes-title">Подобрать по особенностям питания</div><div class="pc-themes">';
    THEMES.forEach(function (t) {
      if (t[a]) html += link(t[a], t.title, page.kind === 'theme' && page.theme === t.key);
    });
    html += '</div>';

    root.className = 'pc-nav';
    root.innerHTML = html;

    // Переносим родной фильтр Tilda в панель (он грузится не сразу — ждём)
    if (TILDA_FILTER_SELECTOR) {
      var tries = 0, timer = setInterval(function () {
        var f = document.querySelector(TILDA_FILTER_SELECTOR);
        var slot = document.getElementById('pc-filters-slot');
        if (f && slot) { slot.appendChild(f); clearInterval(timer); }
        if (++tries > 40) clearInterval(timer); // ~10 секунд
      }, 250);
    }
  }

  function init() {
    var root = document.getElementById('pc-catnav');
    if (!root) return;
    // data-path — тест на скрытой странице: скрипт ведёт себя так, будто открыт этот адрес
    var page = detect(norm(root.getAttribute('data-path') || location.pathname));
    if (!page) { root.style.display = 'none'; return; } // адреса нет в таблицах
    render(root, page);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
