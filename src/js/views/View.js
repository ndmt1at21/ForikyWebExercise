import icons from 'url:../../img/icons.svg';
class View {
    clear() {
        this.parentElement.innerHTML = '';
    }
    addLoadingAnimation() {
        const html = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
        this.clear();
        this.parentElement.insertAdjacentHTML('beforeend', html);
    }
    showError(msg = '') {
        const html = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>`;
        this.clear();
        this.parentElement.insertAdjacentHTML('beforeend', html);
    }
    render(data, render = true) {
        this.data = data;
        const html = this.generateMarkup();
        if (!render)
            return html;
        if (render) {
            this.clear();
            this.parentElement.insertAdjacentHTML('beforeend', html);
            return undefined;
        }
    }
    update(data) {
        if (!data)
            return;
        this.data = data;
        const html = this.generateMarkup();
        const newDom = document.createRange().createContextualFragment(html);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const currElements = Array.from(this.parentElement.querySelectorAll('*'));
        if (!newElements.length || !currElements.length)
            return;
        newElements.forEach((newEle, index) => {
            var _a;
            // So sánh 2 node, nếu khác nhau lấy (khác nhau chứng tỏ thay đổi nội dung: text, attribute, ....)
            // Nhưng thay đổi rất nhiều, ở đây ta chọn thay đổi text (các thông số thay đổi)
            // Để chọn được ta cần lọc ra các node có một child node và node đó có nội dung khác rỗng
            const currEle = currElements[index];
            if (!newEle.isEqualNode(currEle) &&
                ((_a = newEle.firstChild) === null || _a === void 0 ? void 0 : _a.textContent.trim()) !== '') {
                // update text content
                currEle.textContent = newEle.textContent;
            }
            // update attributes all nodes changed
            if (!newEle.isEqualNode(currEle)) {
                const newEleAttrs = Array.from(newEle.attributes);
                newEleAttrs.forEach(attr => currEle.setAttribute(attr.name, attr.value));
            }
        });
    }
}
export default View;
