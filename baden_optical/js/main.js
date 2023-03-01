function toggleHours(id, iconId) {
    table = document.getElementById(id);
    icon = document.getElementById(iconId);
    table.classList.toggle("hidden");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-left")
}

const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("#menu-bar li");

window.addEventListener("scroll", () => {
    current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight
        if (scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach(li => {
		li.classList.remove('active');
		const href = li.firstChild.getAttribute('href').substring(1);
		if (href === current) {
			li.classList.add('active');
		}
	});
});