# DPAF-Net: Dual-Pattern Learning for Fire–Smoke Instance Segmentation with a Large-Scale Dataset

> **Journal:** Pattern Recognition (Elsevier) · **Year:** 2026

## Authors

**Muhammad Ayaz**¹ · **Sareer ul Amin**¹ · **Hikmat Yar**² · **Salman Khan**³ · **Wonseop Shin**¹ · **Sanghyun Seo**¹\*

| # | Affiliation |
|---|-------------|
| ¹ | Department of Applied Art and Technology / College of Art and Technology, **Chung-Ang University**, Seoul & Anseong, Republic of Korea |
| ² | KAIST InnoCORE PRISM-AI Center, **Korea Advanced Institute of Science and Technology (KAIST)**, Daejeon, Republic of Korea |
| ³ | School of Engineering, Computing and Mathematics, **Oxford Brookes University**, Oxford, United Kingdom |

\* Corresponding author · ✉ sanghyun@cau.ac.kr

---

## Abstract

Uncontrolled fire and smoke events cause thousands of fatalities and billions in infrastructure damage annually, yet existing automated detection systems still lack the precision needed for life-critical response. Existing segmentation methods rely on shared feature representations that conflate fire's high-frequency textures and smoke's diffuse, semi-transparent structures, while semantic approaches lack instance-level discrimination and datasets remain limited to single-class annotations.

We introduce **DPAF-Net**, a novel instance segmentation framework built on three core components:

- **Dual-Pattern Encoder (DPE)** — fire-specific 3×3 kernels and smoke-specific large-kernel convolutions (5×5, 7×7) for complementary feature extraction
- **Adaptive Fusion Module (AFM)** — pixel-wise softmax attention to dynamically weight fire and smoke features per spatial location
- **DCNv2-enhanced ResNet-50 backbone** — adaptive modeling of irregular boundaries

DPAF-Net achieves **40.2% AP at 17.2 FPS**, outperforming the best baseline by **+5.2% AP**, with strong boundary precision (AP₇₅: 40.0%), small-object detection (AP_S: 30.4%), and a mean AP of 45.1%. We also release a large-scale dataset of **7,917 images** with dual-class instance-level annotations across diverse real-world environments.

---

## Architecture Overview

```
Input Image
    │
    ▼
DCNv2-enhanced ResNet-50 Backbone  (Stages 2–4 with deformable convolutions)
    │  {C2, C3, C4, C5}
    ▼
Feature Pyramid Network (FPN)      (5 pyramid levels P2–P6, 256-ch each)
    │  {P2, P3, P4, P5, P6}
    ▼
Dual-Pattern Encoder (DPE)
  ├── Fire Branch   (3×3 kernels — high-frequency textures, sharp edges)
  └── Smoke Branch  (5×5 / 7×7 kernels — low-freq, diffuse, semi-transparent)
    │
    ▼
Adaptive Fusion Module (AFM)       (3-stage spatial attention + pixel-wise softmax)
    │
    ▼
CondInst Dynamic Mask Head         (169 dynamic parameters per instance)
    │
    ▼
Instance Masks + Bounding Boxes
```

---

## Key Contributions

1. **Dual-Pattern Encoder (DPE)** — separates fire and smoke representations across FPN levels via two parallel branches: a fire branch (3×3 kernels capturing high-frequency textures/color gradients) and a smoke branch (large-kernel convolutions modeling low-frequency dispersed patterns).

2. **Adaptive Fusion Module (AFM)** — spatial attention generating pixel-wise fusion weights to dynamically integrate complementary fire and smoke features, improving segmentation where both classes coexist or overlap.

3. **DPAF-Net–CondInst unified architecture** — integrates DPE and AFM into a CondInst-based head for accurate instance-level mask generation over overlapping and multi-source fire-smoke regions.

4. **DCNv2-enhanced backbone** — ResNet-50 with deformable convolutional networks (DCNv2) in Stages 2–4 for adaptive receptive fields aligned with irregular flame boundaries and diffuse smoke.

5. **Large-scale dual-class dataset** — 7,917 images with polygon instance-level annotations for both fire and smoke, spanning indoor/outdoor scenes, varying scales, lighting conditions, weather patterns, and background complexities.

---

## Dataset

| Property | Details |
|---|---|
| Total Images | **7,917** |
| Annotation Type | Polygon Mask (Instance-level) |
| Classes | Fire ✔ · Smoke ✔ |
| Environments | Indoor ✔ · Outdoor ✔ |
| Annotation Level | Instance (dual-class) |
| Release Year | 2026 |

Our dataset is the **first large-scale dual-class instance segmentation dataset** for fire and smoke, surpassing all prior benchmarks (SMOKE5K: 5,400 images semantic only; FSSD: 1,968 images; FLAME: 2,003 images) in scale, annotation richness, and environmental diversity.

---

## Results

### Main Comparison

| Method | AP | AP₅₀ | AP₇₅ | AP_S | AP_M | AP_L | FPS |
|---|---|---|---|---|---|---|---|
| Baseline (ResNet-50 + DCNv2 + FPN + CondInst) | 34.2 | 60.8 | 34.3 | 24.8 | 28.4 | 49.3 | — |
| **DPAF-Net (Ours)** | **40.2** | **66.6** | **40.0** | **30.4** | **36.2** | **57.1** | **17.2** |
| Gain | **+6.0** | **+5.8** | **+5.7** | **+5.6** | **+7.8** | **+7.8** | — |

### Ablation Study

| Baseline | DPE | AFM | AP | AP₅₀ | AP₇₅ | AP_S | AP_M | AP_L |
|---|---|---|---|---|---|---|---|---|---|
| ✔ | | | 34.2 | 60.8 | 34.3 | 24.8 | 28.4 | 49.3 |
| ✔ | ✔ | | 38.4 | 64.9 | 38.6 | 28.2 | 32.9 | 54.2 |
| ✔ | | ✔ | 36.6 | 62.7 | 36.2 | 26.3 | 30.5 | 51.6 |
| ✔ | ✔ | ✔ | **40.2** | **66.6** | **40.0** | **30.4** | **36.2** | **57.1** |

---

## Implementation Details

| Setting | Value |
|---|---|
| Framework | MMDetection + PyTorch |
| GPU | NVIDIA RTX 4090 (24 GB) |
| Backbone | ResNet-50 (ImageNet pre-trained) + DCNv2 (Stages 2–4) |
| FPN Channels | 256 (5 levels: P2–P6) |
| Optimizer | AdamW (lr=1e-4, betas=(0.9, 0.999), weight decay=0.05) |
| LR Schedule | 1,000-iter linear warmup → polynomial decay (power 0.9) |
| Batch Size | 8 |
| Input Size | 1333 × 800 |
| Loss | Focal (α=0.25, γ=2.5) + GIoU + BCE + Dice |
| NMS IoU | 0.6 |
| Score Threshold | 0.001 |
| Max Instances | 100 |

**Data Augmentation:** random multi-scale resizing (400–1200), horizontal/vertical flip, photometric distortion, random erasing (1–5 patches, 2–20%).

---

## Highlights

- Pattern-aware dual-branch encoder for fire–smoke feature separation
- Pixel-wise adaptive fusion for overlapping/co-occurring instances
- **+5.2% AP** gain over best baseline · **40.2% AP** at real-time speed (17.2 FPS)
- DCNv2 backbone for irregular fire/smoke boundary modeling
- **7,917-image** dual-class instance segmentation dataset (largest to date)

---

## Citation

If you find this work useful, please cite:

```bibtex
@article{ayaz2026dpafnet,
  title   = {DPAF-Net: Dual-Pattern Learning for Fire--Smoke Instance Segmentation with a Large-Scale Dataset},
  author  = {Ayaz, Muhammad and Amin, Sareer ul and Yar, Hikmat and Khan, Salman and Shin, Wonseop and Seo, Sanghyun},
  journal = {Pattern Recognition},
  year    = {2026},
  publisher = {Elsevier}
}
```

---

## Contact

**Sanghyun Seo** (Corresponding Author)  
College of Art and Technology, Chung-Ang University, Anseong 17546, Republic of Korea  
✉ sanghyun@cau.ac.kr
