/*
Some basic 2D and 3D linear algebra operations.
    - 2D: for manipulations on the screen / canvas
    - 3D: for manipulations for protein structure 3D coordinates
    - manages 3D -> 2D projection
*/


// Main ------------------------------------------------------------------------
export const LinAlg = {

    // 2D ----------------------------------------------------------------------
    // For operations applied on the screen / canvas (as it is 2D)
    dim2: {

        normSquared(arr){
            return arr[0]**2 + arr[1]**2;
        },

        norm(arr){
            return Math.sqrt(arr[0]**2 + arr[1]**2);
        },
          
        normalized(arr){
            const n = this.norm(arr);
            if(n == 0){
                return [0, 0];
            }
            return [arr[0]/n, arr[1]/n];
        },
          
        dot(arr1, arr2){
            return arr1[0]*arr2[0] + arr1[1]*arr2[1];
        },
          
        distanceSquared(arr1, arr2){
            return (arr1[0] - arr2[0])**2 + (arr1[1] - arr2[1])**2;
        },
          
        distance(arr1, arr2){
            return Math.sqrt((arr1[0] - arr2[0])**2 + (arr1[1] - arr2[1])**2);
        },
          
        sum(arr1, arr2){
            return [arr1[0] + arr2[0], arr1[1] + arr2[1]];
        },
          
        scalMult(scalar, arr){
            return [scalar*arr[0], scalar*arr[1]];
        },
          
        scale(arr, scalar, center){
            return this.sum(this.scalMult(scalar, this.sum(arr, this.scalMult(-1, center))), center);
        },
          
        mult(arr, mat){
            return [arr[0]*mat[0][0] + arr[1]*mat[1][0], arr[0]*mat[0][1] + arr[1]*mat[1][1]];
        },
          
        matMult(mat1, mat2){
            const mat1_1 = mat1[0];
            const mat1_2 = mat1[1];
            const mat2_1 = mat2[0];
            const mat2_2 = mat2[1];
            return [
                [mat1_1[0]*mat2_1[0] + mat1_1[1]*mat2_2[0], mat1_1[0]*mat2_1[1] + mat1_1[1]*mat2_2[1]],
                [mat1_2[0]*mat2_1[0] + mat1_2[1]*mat2_2[0], mat1_2[0]*mat2_1[1] + mat1_2[1]*mat2_2[1]]
            ];
        },
          
        getRotationMatrix(angle){
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return [[cos,-sin], [sin,cos]];
        },
          
        rotate(arr, angle){
            return this.mult(arr, this.getRotationMatrix(angle));
        },
          
        rotateAt(arr, angle, center){
            return this.sum(this.rotate(this.sum(arr, this.scalMult(-1, center)), angle), center);
        },
          
        mapToBox(arrs, box){
            const [boxX, boxY] = box;
            const minX = Math.max.apply(null, arrs.map(arr => arr[0]))
            const maxX = Math.max.apply(null, arrs.map(arr => arr[0]))
            const minY = Math.max.apply(null, arrs.map(arr => arr[1]))
            const maxY = Math.max.apply(null, arrs.map(arr => arr[1]))
            const deltaX = maxX - minX;
            const deltaY = maxY - minY;
            const deltaBoxX = boxX[1] - boxX[0];
            const deltaBoxY = boxY[1] - boxY[0];
            const coeff = Math.max(deltaX / deltaBoxX, deltaY / deltaBoxY);
            const deviation = [deltaX/(2*coeff) - deltaBoxX/2, deltaY/(2*coeff) - deltaBoxY/2];
            const shiftX = boxX[0] - deviation[0];
            const shiftY = boxY[0] - deviation[1];
            return [
                arrs.map(arr => [
                    (arr[0] - minX)/coeff + shiftX,
                    (arr[1] - minY)/coeff + shiftY
                ]),
                coeff
            ];
        },
          
    },

    // 3D ----------------------------------------------------------------------
    // For operations applied on protein coordinates (as they are 3D)
    dim3: {

        normSquared(arr){
            return arr[0]**2 + arr[1]**2 + arr[2]**2;
        },
          
        norm(arr){
            return Math.sqrt(arr[0]**2 + arr[1]**2 + arr[2]**2);
        },
          
        normalized(arr){
            const n = this.norm(arr);
            if(n == 0){
                return [0, 0, 0];
            }
            return [arr[0]/n, arr[1]/n, arr[2]/n];
        },
          
        dot(arr1, arr2){
            return arr1[0]*arr2[0] + arr1[1]*arr2[1] + arr1[2]*arr2[2];
        },
          
        distanceSquared(arr1, arr2){
            return (arr1[0] - arr2[0])**2 + (arr1[1] - arr2[1])**2 + (arr1[2] - arr2[2])**2;
        },
          
        distance(arr1, arr2){
            return Math.sqrt((arr1[0] - arr2[0])**2 + (arr1[1] - arr2[1])**2 + (arr1[2] - arr2[2])**2);
        },
          
        sum(arr1, arr2){
            return [arr1[0] + arr2[0], arr1[1] + arr2[1], arr1[2] + arr2[2]];
        },
          
        scalMult(scal, arr){
            return [scal*arr[0], scal*arr[1], scal*arr[2]];
        },
          
        scale(arr, scalar, center){
            return this.sum(this.scalMult(scalar, this.sum(arr, this.scalMult(-1, center))), center);
        },
          
        mult(arr, mat){
            return [
                arr[0]*mat[0][0] + arr[1]*mat[1][0] + arr[2]*mat[2][0],
                arr[0]*mat[0][1] + arr[1]*mat[1][1] + arr[2]*mat[2][1],
                arr[0]*mat[0][2] + arr[1]*mat[1][2] + arr[2]*mat[2][2]
            ];
        },
          
        matMult(mat1, mat2){
            return [
                [
                    mat1[0][0]*mat2[0][0] + mat1[0][1]*mat2[1][0] + mat1[0][2]*mat2[2][0],
                    mat1[0][0]*mat2[0][1] + mat1[0][1]*mat2[1][1] + mat1[0][2]*mat2[2][1],
                    mat1[0][0]*mat2[0][2] + mat1[0][1]*mat2[1][2] + mat1[0][2]*mat2[2][2],
                ],
                [
                    mat1[1][0]*mat2[0][0] + mat1[1][1]*mat2[1][0] + mat1[1][2]*mat2[2][0],
                    mat1[1][0]*mat2[0][1] + mat1[1][1]*mat2[1][1] + mat1[1][2]*mat2[2][1],
                    mat1[1][0]*mat2[0][2] + mat1[1][1]*mat2[1][2] + mat1[1][2]*mat2[2][2],
                ],
                [
                    mat1[2][0]*mat2[0][0] + mat1[2][1]*mat2[1][0] + mat1[2][2]*mat2[2][0],
                    mat1[2][0]*mat2[0][1] + mat1[2][1]*mat2[1][1] + mat1[2][2]*mat2[2][1],
                    mat1[2][0]*mat2[0][2] + mat1[2][1]*mat2[1][2] + mat1[2][2]*mat2[2][2],
                ]
            ];
        },
          
        getRotationMatrix(angleXZ, angleYZ){
            const cosXZ = Math.cos(angleXZ);
            const sinXZ = Math.sin(angleXZ);
            const cosYZ = Math.cos(angleYZ);
            const sinYZ = Math.sin(angleYZ);
            const matXZ = [
                [cosXZ,      0, -sinXZ],
                [    0,      1,      0],
                [sinXZ,      0,  cosXZ]
            ];
            const matYZ = [
                [    1,      0,      0],
                [    0,  cosYZ, -sinYZ],
                [    0,  sinYZ,  cosYZ]
            ];
            return this.matMult(matXZ, matYZ);
        },
          
        rotate(arr, angleXZ, angleYZ){
            return this.mult(arr, getRotationMatrix(angleXZ, angleYZ));
        },
          
        rotateAt(arr, angle, center){
            return this.sum(this.rotate(this.sum(arr, this.scalMult(-1, center)), angle), center);
        },
          
        mapToBox(arrs, box){
            const [boxX, boxY, boxZ] = box;
            const minX = Math.min.apply(null, arrs.map(arr => arr[0]));
            const maxX = Math.max.apply(null, arrs.map(arr => arr[0]));
            const minY = Math.min.apply(null, arrs.map(arr => arr[1]));
            const maxY = Math.max.apply(null, arrs.map(arr => arr[1]));
            const minZ = Math.min.apply(null, arrs.map(arr => arr[2]));
            const maxZ = Math.max.apply(null, arrs.map(arr => arr[2]));
            const deltaX = maxX - minX;
            const deltaY = maxY - minY;
            const deltaZ = maxZ - minZ;
            const deltaboxX = boxX[1] - boxX[0];
            const deltaboxY = boxY[1] - boxY[0];
            const deltaboxZ = boxZ[1] - boxZ[0];
            const coeff = Math.max(deltaX / deltaboxX, deltaY / deltaboxY,  deltaZ / deltaboxZ);
            const deviation = [
                deltaX/(2*coeff) - deltaboxX/2,
                deltaY/(2*coeff) - deltaboxY/2,
                deltaZ/(2*coeff) - deltaboxZ/2,
            ];
            const shiftX = boxX[0] - deviation[0];
            const shiftY = boxY[0] - deviation[1];
            const shiftZ = boxZ[0] - deviation[2];
            return [
                arrs.map(arr => [
                    (arr[0] - minX)/coeff + shiftX,
                    (arr[1] - minY)/coeff + shiftY,
                    (arr[2] - minZ)/coeff + shiftZ
                ]),
                coeff
            ];
        },

        project2D(arr, dist){
            const t = dist / (dist - arr[2]);
            return [arr[0]*t, arr[1]*t];
        },

   }
}
