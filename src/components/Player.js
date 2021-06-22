export default class Player {
    constructor() {
        this.sound = null;
        this.disc = document.querySelector('#disque');
        this.title = document.querySelector('#soundTitle');
        this.date =  document.querySelector('#soundDate');
        this.artist = document.querySelector('#soundArtist');

        this.toggle(true);
    }

    toggle(show) {

        if(show) this.disc.classList.add('show');
        if(!show) this.disc.classList.remove('show');

        this.date.innerText = '';
        this.title.innerText = '';
    }

    playSound(sound) {

        this.sound = sound;

        // Animate the vinyle
        this.disc.classList.add('rotate');

        // Affichage du titre
        setTimeout(() => {


            // Edit the artist of vinyle

            this.artist.innerText = this.sound?.artist;
              // Edit the title of vinyle
              this.title.innerText = this.sound?.title;
  
              // Edit the date of the vinyle
             this.date.innerText = this.sound?.date;

        }, 600);

        // Stop animation
        setTimeout(() => {

            this.disc.classList.remove('rotate');

        }, 2000);

    }
}