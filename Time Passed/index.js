const day_of_week_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//days in a month

//to determin days in a month
function month_days(month, year) {
    //check for leap year and days in february
    if (month == 2) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                if (year % 400 == 0) {
                    return 29;
                }
                return 28;
            }
            return 29;
        }
        return 28;
    }
    return days[month - 1];//days for other months
}
//days in that year
function year_days(year) {
    let days = 0;
    for (let i = 1; i <= 12; i++) {
        days += month_days(i, year);
    }
    return days;
}

function render_current_time() {
    let now = new Date();
    let hours = `${now.getHours()}`.padStart(2, "0");
    let minutes = `${now.getMinutes()}`.padStart(2, "0");
    let seconds = `${now.getSeconds()}`.padStart(2, "0");
    let day = `${now.getDate()}`.padStart(2, "0");
    let month = `${now.getMonth() + 1}`.padStart(2, "0");
    let year = now.getFullYear();
    let day_of_week = now.getDay();
    document.getElementById("current-time").innerText = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${day_of_week_names[day_of_week]}`;
    setTimeout(render_current_time, 200);
}

function generate_ticks(id, count) {
    let bar = document.getElementById(id);
    let ticks_html = "";
    for (let i = 1; i < count; i++) {
        ticks_html += `<span class="tick" style="left: ${i * 100 / count}%"></span>`;
    }
    bar.innerHTML += ticks_html;
}

function render_progress_bar() {
    let now = new Date();
    let year_parent = document.getElementById("year");
    let year_progress = year_parent.children[0];
    let year_progress_bar = year_parent.children[1];
    let month_parent = document.getElementById("month");
    let month_progress = month_parent.children[0];
    let month_progress_bar = month_parent.children[1];
    let week_parent = document.getElementById("week");
    let week_progress = week_parent.children[0];
    let week_progress_bar = week_parent.children[1];
    let day_parent = document.getElementById("day");
    let day_progress = day_parent.children[0];
    let day_progress_bar = day_parent.children[1];
    // year
    let seconds_of_passed_months = 0;
    for (let i = 1; i < now.getMonth() + 1; i++) {
        seconds_of_passed_months += month_days(i, now.getFullYear()) * 86400;
    }
    seconds_of_passed_months += (now.getDate() - 1) * 86400;
    seconds_of_passed_months += now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600;
    let year_percentage = seconds_of_passed_months * 100 / (year_days(now.getFullYear()) * 86400);
    year_progress_bar.style.width = year_percentage.toFixed(2) + "%";
    year_progress.innerText = year_percentage.toFixed(2) + "%";
    // month
    let seconds_of_passed_days = 86400 * (now.getDate() - 1);
    seconds_of_passed_days += now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600
    let month_percentage = seconds_of_passed_days * 100 / (month_days(now.getMonth() + 1, now.getFullYear()) * 86400);
    month_progress_bar.style.width = month_percentage.toFixed(2) + "%";
    month_progress.innerText = month_percentage.toFixed(2) + "%";
    // week
    let seconds_of_passed_days_of_week = 86400 * (now.getDay());
    seconds_of_passed_days_of_week += now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600;
    let week_percentage = seconds_of_passed_days_of_week * 100 / (86400 * 7);
    week_progress_bar.style.width = week_percentage.toFixed(2) + "%";
    week_progress.innerText = week_percentage.toFixed(2) + "%";
    // day
    let day_percentage = (now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600) * 100 / 86400;
    day_progress_bar.style.width = day_percentage.toFixed(2) + "%";
    day_progress.innerText = day_percentage.toFixed(2) + "%";
    setTimeout(render_progress_bar, 1000);
}

render_progress_bar();
render_current_time();
generate_ticks("year", 12);
generate_ticks("month", 4);
generate_ticks("week", 7);
generate_ticks("day", 2);