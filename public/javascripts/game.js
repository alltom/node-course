var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
	socket.emit('my other event', { my: 'data' });
});

function HiddenImage(width, height, rows, cols, imageURL) {
    this.rows = rows;
    this.cols = cols;
    
    this.$dom = $('<div />').css({ position: 'relative' });
    this.$image = $('<img />').attr('src', imageURL).appendTo(this.$dom);
    this.cells = {};
    
    this.cellWidth = width/cols;
    this.cellHeight = height/rows;
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var $cell = this._makeCell(row, col);
            this.cells[this._cellKey(row, col)] = $cell;
        }
    }
}
HiddenImage.prototype = {
    _makeCell: function (row, col) {
        var self = this;
        var $cell = $('<div />').appendTo(this.$dom);
        $cell.css({
            position: 'absolute',
            top: row * this.cellHeight,
            left: col * this.cellWidth,
            width: this.cellWidth,
            height: this.cellHeight,
            background: 'red',
        });
        $cell.on('click', function () {
            self.hideCell(row, col);
        });
        return $cell;
    },
    _cellKey: function (row, col) {
        return row + ', ' + col;
    },
    hideCell: function (row, col) {
        var self = this;
        var key = this._cellKey(row, col);
        var $cell = this.cells[key];
        delete this.cells[key];
        if ($cell) {
            $cell.css({ background: '#800' });
            this.oncellclick(row, col, function (remove) {
                if (remove) {
                    $cell.fadeOut();
                } else {
                    $cell.css({ background: 'red' });
                    self.cells[key] = $cell;
                }
            });
        }
    },
    // override this to add custom behavior when cells are clicked
    oncellclick: function (row, col, removeCallback) {
        removeCallback(true);
    },
};

$(function () {
    var grid = new HiddenImage(500, 282, 5, 5, 'images/falling.gif');
    grid.oncellclick = function (row, col, removeCallback) {
        setTimeout(function () {
            removeCallback(Math.random() > 0.5);
        }, Math.random() * 3000);
    };
    $(document.body).append(grid.$dom);
});
