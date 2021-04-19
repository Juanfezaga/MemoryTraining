class Grid {
  constructor(gridTable, nGrid, callbacks) {
    this.gridTable = gridTable;
    this.nGrid = nGrid;

    this.counter = 0;

    this.images = [];
    this.selectedImages = [];
    this.correctImages = 0;

    this.fetchData();
  }

  shuffleGrid(arr) {
    let currenIndex = arr.length,
      temporaryValue,
      randomIndex;

    while (0 !== currenIndex) {
      randomIndex = Math.floor(Math.random() * currenIndex);
      currenIndex--;

      temporaryValue = arr[currenIndex];
      arr[currenIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }

    return arr;
  }

  async fetchData() {
    for (let i = 0; i < this.nGrid / 2; i++) {
      const result = await fetch("https://picsum.photos/300/300");
      this.images.push(result.url);
      this.images.push(result.url);
    }
    return Promise.resolve(this.createGrid());
  }

  appendGridItem = (imagen) => {
    let gridImage = document.createElement("div");
    gridImage.classList.add("scene");
    gridImage.classList.add("scene--card");
    gridImage.innerHTML = `
      <div class="card">
        <div class="card__face card__face--front">${this.counter+1}</div>
        <div class="card__face card__face--back" style="background: url(${imagen})" id="${this.counter}"></div>
      </div>
    `;
    this.counter++;
    this.gridTable.appendChild(gridImage);
  };

  createGrid() {
    this.images = this.shuffleGrid(this.images);
    this.images.forEach((e) => {
      this.appendGridItem(e);
    });
    let cardImages = document.querySelectorAll(".card");
    cardImages.forEach((el) => this.flippCard(el));
    this.checkImages();
  }

  flippCard(el) {
    el.addEventListener("click", () => {
      el.classList.toggle("is-flipped");
    });
  }

  isSelected = (el) => {
    let element = el.target.nextElementSibling;
    try {
      if (!element.parentElement.classList.contains("isCorrect") && element?.parentElement !== null) {
        this.selectedImages.push(element);
      }
    } catch (error) {
    }
    

    if (this.selectedImages.length === 2) {
      if (this.check()) {
        this.selectedImages = [];
      }
      this.isCorrect();
      this.selectedImages = [];
    }
  };

  check = () => {
    this.selectedImages[0].classList.contains("isCorrect") ||
    this.selectedImages[1].classList.contains("isCorrect")
      ? true
      : false;
  };

  isCorrect = () => {
    let image1 = document.getElementById(`${this.selectedImages[0].id}`);
    let image2 = document.getElementById(`${this.selectedImages[1].id}`);

    if (image1 !== image2) {
      if (image1.style.backgroundImage === image2.style.backgroundImage) {
        this.correctImages++;
        if (this.correctImages === this.nGrid / 2) {
          this.wonGame();
        }
        image1.parentElement.classList.add("isCorrect");
        image1.parentElement.removeEventListener("click", this.isSelected);
        image2.parentElement.classList.add("isCorrect");
        image2.parentElement.removeEventListener("click", this.isSelected);
        if (
          image1.parentElement.classList.contains("isCorrect") &&
          image2.parentElement.classList.contains("isCorrect")
        ) {
          image1.parentElement.classList.add("is-flipped");
          image2.parentElement.classList.add("is-flipped");
          image1.parentElement.removeEventListener(
            "click",
            this.flippCard(image1.parentElement)
          );
          image2.parentElement.removeEventListener(
            "click",
            this.flippCard(image2.parentElement)
          );
        }
      } else {
        image1.parentElement.classList.remove("is-flipped");
        setTimeout(() => {
          image2.parentElement.classList.remove("is-flipped");
        }, 500);
      }
    }
  };

  showImages = () => {
    this.imgElements.forEach((el) => {
      el.classList.remove("is-flipped");
    });
  };
  checkImages = () => {
    this.imgElements = document.querySelectorAll(".card");
    setTimeout(this.showImages, 4000);
    this.imgElements.forEach((el) => {
      el.classList.add("is-flipped");
      el.addEventListener("click", this.isSelected);
    });
  };

  wonGame = () => {
    let myModal = document.querySelector(".middle");
    myModal.remove(this.gridTable);
    myModal.innerHTML = `
    <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">!Congratulations!</p>
        <button class="delete" aria-label="close" id="close-modal"></button>
      </header>
      <section class="modal-card-body">
        Congratulations, you won the game! would you like to try again?
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="restart">Restart</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>
    `;
    document.body.appendChild(myModal);

    let closeModal = document.querySelector("#close-modal");
    let restartGame = document.querySelector("#restart");

    restartGame.addEventListener("click", () => {
      document.querySelector(".modal").classList.remove("is-active");
      let container = document.createElement("div");
      container.id = "container";
      myModal.appendChild(container);
      let restartGame = new Grid(container, this.nGrid * 2);
      restartGame.createGrid();
    });
  };
}
const grid = document.querySelector("#container");
const newGame = new Grid(grid, 12);
