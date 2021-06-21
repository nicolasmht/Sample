//Get the position of element from top of the page
function offsetTop(element, acc = 0) {
    if(element.offsetTop) {
        return offsetTop(element.offsetParent, acc + element.offsetTop)
    }
    return acc + element.offsetTop
}

class Parallax {
    constructor(element) {
        this.element = element

        this.ratio = parseFloat(element.dataset.parallax)
        this.onScroll = this.onScroll.bind(this)

        this.onIntersection = this.onIntersection.bind(this)
        this.elementY = offsetTop(this.element) + this.element.offsetHeight / 2
        const observer = new IntersectionObserver(this.onIntersection)
        observer.observe(element)
        this.onScroll()

        // document.addEventListener('scroll', this.onScroll)
    }

    //Entries its IntersectionObserverEntry []
    onIntersection(entries) {
        for(const entry of entries) {
            if(entry.isIntersecting) {
                document.addEventListener('scroll', this.onScroll)
                this.elementY = offsetTop(this.element) + this.element.offsetHeight / 2
            } else {
                document.removeEventListener('scroll', this.onScroll)
            }
        }
    }

    onScroll() {
        window.requestAnimationFrame(()=> {
            const screenY = window.scrollY + window.innerHeight / 2
            const diffY = this.elementY - screenY
            this.element.style.setProperty("transform", `translateY(${diffY * -1 * this.ratio}px)`)
            this.element.style.opacity = 1;
        })
    }

    static bind() {
        return Array.from(document.querySelectorAll('[data-parallax]')).map((element)=> {
            return new Parallax(element)
        })
    }
}

Parallax.bind()