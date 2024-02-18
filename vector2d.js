// ----------------------------------------------------------------------------
// Visualización de datos avanzada (ITAM - Primavera 2024)
// J. Ezequiel Soto S.
// ----------------------------------------------------------------------------

class Vector2D {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    // Vector addition
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    // Scalar multiplication
    scale(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    // Dot product
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    // Euclidean distance
    distance(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Apply a 2D transformation matrix
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
    transform(matrix) {
        return new Vector2D(
            matrix.a * this.x + matrix.c * this.y + matrix.e,
            matrix.b * this.x + matrix.d * this.y + matrix.f
        );
    }
}

// Example of class inheritance:
class Point extends Vector2D {
    constructor(x, y) {
        super(x, y);
    }

    // Draw the point
    draw(ctx, rad, color) {
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // Change position
    pos(vec){
        this.x = vec.x;
        this.y = vec.y;
    }

    // Extend lerp method
    lerp(point, t) {
        return new Point(
            this.x + (point.x - this.x) * t,
            this.y + (point.y - this.y) * t
        );
    }
}


