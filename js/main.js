// Точка входа калькулятора
console.log('Калькулятор запущен');
const button = document.querySelectorAll('.key'); // Находим кнопку
const result = document.querySelector('.calculator__result')
// строка, в которую добавляются значения кнопок после каждого нажатия, кроме знака "="
let strResult = '';
// переменная, которая выводит ответ после нажатия "="
let counting = 0;
// Когда пользователь кликает:
button.forEach(btn => {
    btn.addEventListener('click', () => {
        const valueBtn = btn.dataset.value;
        checkInput(valueBtn);
        // Если нажата "АС"
        if (valueBtn === 'AC') {
            result.textContent = 0;
            strResult = '';
        } else if (valueBtn === 'backspace') {
            // Удаляем последний символ строки (если строка пустая — slice вернёт её же)
            strResult = strResult.slice(0, -1);
            // Показываем то, что осталось; если всё стёрли — показываем 0
            result.textContent = strResult || 0;
        } else if (valueBtn === '=') {
            if (strResult == '') {
                return;
            }
            result.textContent += ' = ';
            operatorCheck()
            result.textContent += counting;
            // сбрасываем, чтобы не копился
            strResult = `${counting}`;
            counting = 0;
        }
        else {
            result.textContent = strResult;
            console.log(strResult)
        }
    })
})
let newArrayResult = '';
// функция - что происходит после знака равно, смотрит на strResult
function operatorCheck() {
    // подсчет результата
    // Если нажат и "+" и "-"
    if (strResult.includes('%')) {
        newArrayResult = strResult.trim().split(/\s*([%+\-*/])\s*/).filter(item => item !== '');
        counting = Number(newArrayResult[0])
        counting = procentCheck(counting, newArrayResult)
        counting = parseFloat(counting.toFixed(5))
        return counting;
    } else if (strResult.includes('*') || strResult.includes('/')) {
        newArrayResult = strResult.split(/([*/+-])/);
        console.log(newArrayResult)
        counting = mulDel(counting, newArrayResult);
        counting = plusMinus(counting, newArrayResult);
        counting = parseFloat(counting.toFixed(5))
        console.log(counting)
        return counting;
    } else if (strResult.includes('-') || strResult.includes('+')) {
        newArrayResult = strResult.split(/([+-])/);
        counting = Number(newArrayResult[0])
        counting = plusMinus(counting, newArrayResult);
        counting = parseFloat(counting.toFixed(5))
        console.log(newArrayResult)
        console.log(counting)
        return counting;
    }
    return counting;
}
// функци, которая срабатывает если нажат и "+" и "-"
function plusMinus(counting, newArrayResult) {
    for (let i = 1; i < newArrayResult.length; i += 2) {
        if (newArrayResult[i] === '+') {
            // прибавляем следующее число к текущему counting 
            counting += Number(newArrayResult[i + 1]);
        } else if (newArrayResult[i] === '-') {
            // вычитаем следующее число из текущего counting
            counting -= Number(newArrayResult[i + 1]);
        }
    }
    return counting
}
function mulDel(counting, newArrayResult) {
    for (let i = 1; i < newArrayResult.length; i += 2) {
        if (newArrayResult[i] === '*') {
            // результат умножения подставляем на место тройки [число, *, число] — оно станет одним числом
            newArrayResult.splice(i - 1, 3, String(Number(newArrayResult[i - 1]) * Number(newArrayResult[i + 1])));
            // массив уменьшился на 2 элемента, сдвигаем цикл назад, чтобы не пропустить следующий оператор
            i -= 2;
        } else if (newArrayResult[i] === '/') {
            // то же самое для деления
            newArrayResult.splice(i - 1, 3, String(Number(newArrayResult[i - 1]) / Number(newArrayResult[i + 1])));
            i -= 2;
        }
    }
    // возвращаем первый (схлопнутый) операнд — с него продолжит считать plusMinus
    counting = Number(newArrayResult[0]);
    return counting;
}
function procentCheck(counting, newArrayResult) {
    let procentForNumber = 0;
    for (let i = 1; i < newArrayResult.length; i += 2) {
        procentForNumber = (Number(newArrayResult[i + 1]) / 100)
        counting *= procentForNumber;
        if (newArrayResult.includes('+')) {
            counting = Number(newArrayResult[i - 1]) + counting
            return counting;
        } 
        counting = Number(newArrayResult[i - 1]) - counting
        console.log('procent ' + counting)
        return counting;
    }
}
// Функция проверки, если нажато что то кроме "=" и служебных кнопок, то добавляем их значение в strResult
function checkInput(valueBtn) {
    if (valueBtn !== '=' && valueBtn !== 'AC' && valueBtn !== 'backspace') {
        strResult += valueBtn;
    }
}

// ===== Прокрутка экрана вправо (для мобильных) =====

// Контейнер дисплея — именно он скроллится, когда цифры не влезают по ширине
const display = document.querySelector('.calculator__display');

// Прижимаем скролл к правому краю,
// чтобы последняя цифра (в т.ч. ответ после "=") всегда была видна
function scrollResultToEnd() {
    display.scrollLeft = display.scrollWidth; // scrollWidth — полная ширина контента, scrollLeft = ему = самый правый край
}

// Наблюдатель следит за тем, как меняется текст внутри result
// (textContent в JS редактирует текстовый узел — это ловится флагами ниже)
const resultObserver = new MutationObserver(() => {
    scrollResultToEnd(); // при любом изменении результата — прокручиваем вправо
});

// childList — добавление/удаление текстового узла, characterData — правка текста, subtree — внутри дочерних узлов
resultObserver.observe(result, {
    childList: true,
    characterData: true,
    subtree: true,
});