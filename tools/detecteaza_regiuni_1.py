import cv2,numpy as np,json,sys
from PIL import Image
im=np.array(Image.open('/home/claude/meta/harta_relief_romania_numerotata.png'))
H,W=im.shape[:2]; s=W/2000; alpha=im[...,3]
img=np.full((H,W,3),255,np.uint8); img[alpha>0]=im[alpha>0][:,:3]
r,g,b=[img[...,i].astype(int) for i in range(3)]
blue=((b>r+35)&(b>g+15)).astype(np.uint8); blue=cv2.dilate(blue,np.ones((3,3),np.uint8))
clean=cv2.inpaint(img,blue*255,5,cv2.INPAINT_TELEA)
cv2.imwrite('/home/claude/tools/clean.png',clean[:,:,::-1])
dark=((clean.max(axis=2)<110)|(alpha==0)).astype(np.uint8)
dark=cv2.dilate(dark,np.ones((5,5),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats((1-dark).astype(np.uint8),connectivity=4)
# render component map with ids for big comps
vis=clean[:,:,::-1].copy()
rng=np.random.default_rng(3); cols=rng.integers(0,255,(n,3))
big=[i for i in range(1,n) if st[i,4]>4000]
ov=vis.copy()
for i in big: ov[lab==i]=cols[i]
vis=cv2.addWeighted(vis,0.4,ov,0.6,0)
for i in big:
    ys,xs=np.where(lab==i); k=len(xs)//2
    # place id at centroid-ish pixel inside comp
    cx,cy=int(np.median(xs)),int(np.median(ys))
    if lab[cy,cx]!=i: cx,cy=xs[k],ys[k]
    cv2.putText(vis,str(i),(cx-20,cy+10),cv2.FONT_HERSHEY_SIMPLEX,1.6,(255,255,255),7); cv2.putText(vis,str(i),(cx-20,cy+10),cv2.FONT_HERSHEY_SIMPLEX,1.6,(0,0,0),3)
np.save('/home/claude/tools/lab.npy',lab)
cv2.imwrite(sys.argv[1],cv2.resize(vis,(2000,int(2000*H/W))))
print(n,len(big))
