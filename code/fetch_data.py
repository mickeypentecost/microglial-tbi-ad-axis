#!/usr/bin/env python3
"""Fetch the open raw datasets used in the final submission.

Every dataset that enters one of the eight figures is listed here with its exact
GEO/GWAS/Zenodo location and the specific file(s) used, so the analyses can be
reproduced from primary sources. Controlled-access data (Synapse/ROSMAP
individual genotypes, ADNI-DoD) are NOT used and are not fetched — only open
summary/QTL layers are, and those URLs are in DATA_PROVENANCE.md.

Two large processed single-nucleus objects are obtained outside this script:
  * CEREBRI mouse TBI snRNA  — GEO GSE269748 (processed clean.h5ad; the count
    matrices are in the GEO supplementary; the clean.h5ad used here is the
    author-processed object).
  * SEA-AD human MTG snRNA   — Allen Institute SEA-AD data portal
    (sea-ad.org / CELLxGENE "SEA-AD"); download the MTG glia subset.
Place both under  <repo>/../csgia_h5ad/  (paths are documented in DATA_PROVENANCE.md).

Usage:
    python code/fetch_data.py --list              # show every dataset + file
    python code/fetch_data.py --dataset GSE276182 # fetch one open GEO set
    python code/fetch_data.py --all-open          # fetch all open GEO/GWAS files

Env: ENV 1 (analysis) — stdlib only for the fetch itself.
"""
import argparse
import os
import ssl
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")

# GEO supplementary files are served from the FTP suppl path:
#   https://ftp.ncbi.nlm.nih.gov/geo/series/GSEnnn/GSE######/suppl/<file>
def geo_suppl_url(gse, fname):
    stub = gse[:-3] + "nnn"
    return f"https://ftp.ncbi.nlm.nih.gov/geo/series/{stub}/{gse}/suppl/{fname}"


# --- the used-set: each entry is (accession, [files], role) ------------------
DATASETS = {
    # AD GWAS — fully scripted separately in code/_munge_stream.py (755 MB stream)
    "GCST90027158": {
        "url": "https://ftp.ebi.ac.uk/pub/databases/gwas/summary_statistics/"
               "GCST90027001-GCST90028000/GCST90027158/"
               "GCST90027158_buildGRCh38.tsv.gz",
        "role": "AD GWAS (Bellenguez 2022); genetic anchor. See code/_munge_stream.py.",
    },
    # Bulk RNA-seq — resolution / CD44 arm
    "GSE153873": {
        "files": ["GSE153873_summary_count.star.txt.gz"],
        "role": "human AD hippocampus bulk (resolution-gene detection).",
    },
    "GSE276182": {
        "files": ["GSE276182_gene_count_TBI.txt.gz"],
        "role": "mouse sorted astrocyte+microglia bulk +/- TBI (astrocyte CD44/TSG-6 arm; Fig 5, Supp 2).",
    },
    # Spatial — Fig 2
    "GSE263793": {
        "files": [],  # per-section *_bin1_max.gem.txt.gz + *_PlaqueSegmentation_*.png.gz (see DATA_PROVENANCE)
        "role": "mouse AD Stereo-seq w/ plaque masks (Fig 2 plaque niche). Large; browse GEO for section files.",
    },
    "GSE319409": {
        "files": [],  # 6 TBI + 6 Sham Visium CytAssist sections (see DATA_PROVENANCE)
        "role": "mouse TBI 10x Visium (Fig 2 lesion gradient). Browse GEO for section files.",
    },
    "GSE203424": {
        "files": [],
        "role": "APP/PS1 Visium genotype contrast (spatial focality control).",
    },
    # snRNA — accelerator arm (processed h5ads fetched outside this script)
    "GSE269748": {
        "files": [],
        "role": "CEREBRI mouse TBI snRNA time-course. Processed clean.h5ad used; see module docstring.",
    },
    # Chronic injury validation — Supp 3
    "GSE261807": {
        "files": [],
        "role": "human repetitive-head-impact / CTE snRNA (Supp 3 validation). Per-sample GSM tar; see DATA_PROVENANCE.",
    },
}

CTX = ssl.create_default_context()


def _download(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest):
        print(f"  exists: {dest}")
        return
    print(f"  fetching {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "python-urllib"})
    with urllib.request.urlopen(req, timeout=300, context=CTX) as r, open(dest, "wb") as f:
        while True:
            chunk = r.read(4 << 20)
            if not chunk:
                break
            f.write(chunk)
    print(f"  wrote {dest} ({os.path.getsize(dest)} bytes)")


def fetch(acc):
    d = DATASETS[acc]
    print(f"[{acc}] {d['role']}")
    if "url" in d:  # GWAS direct URL
        _download(d["url"], os.path.join(RAW, acc, os.path.basename(d["url"])))
        return
    files = d.get("files", [])
    if not files:
        print("  (no small supplementary file scripted; browse GEO — see DATA_PROVENANCE.md)")
        return
    for fn in files:
        _download(geo_suppl_url(acc, fn), os.path.join(RAW, acc, fn))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--dataset")
    ap.add_argument("--all-open", action="store_true")
    a = ap.parse_args()
    if a.list or (not a.dataset and not a.all_open):
        for acc, d in DATASETS.items():
            print(f"{acc:15s} {d['role']}")
        if not a.list:
            print("\nUse --dataset <ACC> or --all-open to fetch.")
        return
    if a.dataset:
        fetch(a.dataset)
    if a.all_open:
        for acc in DATASETS:
            fetch(acc)


if __name__ == "__main__":
    main()
